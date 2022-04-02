import {
  PoolFilter,
  SOR,
  SubgraphPoolBase,
  SwapInfo,
  SwapOptions,
  SwapTypes
} from '@balancer-labs/sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { Provider } from '@ethersproject/providers';
import { AddressZero } from '@ethersproject/constants';
import OldBigNumber from 'bignumber.js';
import { Pool, Swap } from '@balancer-labs/sor/dist/types';
import { NATIVE_ASSET_ADDRESS } from '@/constants/tokens';
import { balancer } from '@/lib/balancer.sdk';
import { beethovenxService } from '@/beethovenx/services/beethovenx/beethovenx.service';

const SWAP_COST = process.env.VUE_APP_SWAP_COST || '100000';
export enum LiquiditySelection {
  Best = 'best',
  V1 = 'v1',
  V2 = 'v2'
}

export interface SorReturn {
  isV1swap: boolean;
  isV1best: boolean;
  tokenIn: string;
  tokenOut: string;
  returnDecimals: number;
  hasSwaps: boolean;
  returnAmount: BigNumber;
  marketSpNormalised: string;
  v1result: [Swap[][], BigNumber, OldBigNumber];
  v2result: SwapInfo;
}

interface FetchStatus {
  v1finishedFetch: boolean;
  v2finishedFetch: boolean;
  v1success: boolean;
  v2success: boolean;
}

/*
Aims to manage liquidity between V1 & V2 using SOR.
*/
export class SorManager {
  private sorV2: SOR;
  private weth: string;
  private fetchStatus: FetchStatus = {
    v1finishedFetch: false,
    v2finishedFetch: false,
    v1success: false,
    v2success: false
  };
  private isV1Supported: boolean;
  private isFetching: boolean;
  maxPools: number;
  gasPrice: BigNumber;
  selectedPools: (SubgraphPoolBase | Pool)[] = [];

  constructor(
    isV1Supported: boolean,
    provider: Provider,
    gasPrice: BigNumber,
    maxPools: number,
    chainId: number,
    weth: string
  ) {
    this.isV1Supported = isV1Supported;

    this.sorV2 = balancer.sor;
    this.weth = weth;
    this.gasPrice = gasPrice;
    this.maxPools = maxPools;
    this.isFetching = false;
  }

  // Uses SOR V2 to retrieve the cost & reuses for SOR V1 to save time (requires onchain call).
  // If previously called the cached value will be used.
  async setCostOutputToken(
    tokenAddr: string,
    tokenDecimals: number,
    manualCost: string | null = null
  ): Promise<BigNumber> {
    tokenAddr = tokenAddr === NATIVE_ASSET_ADDRESS ? this.weth : tokenAddr;

    if (manualCost) {
      await this.sorV2.swapCostCalculator.setNativeAssetPriceInToken(
        tokenAddr,
        manualCost
      );
    }

    const cost = await this.sorV2.getCostOfSwapInToken(
      tokenAddr,
      tokenDecimals,
      this.gasPrice,
      BigNumber.from(SWAP_COST)
    );

    console.log(`[SorManager] Cost for token ${tokenAddr}: ${cost.toString()}`);

    return cost;
  }

  // This fetches ALL pool with onchain info.
  async fetchPools(): Promise<void> {
    //left for backwards compatability
  }

  // Gets swaps for V1 & V2 liquidity and determined best result
  async getBestSwap(
    tokenIn: string,
    tokenOut: string,
    tokenInDecimals: number,
    tokenOutDecimals: number,
    swapType: SwapTypes,
    amountNormalized: OldBigNumber,
    swapDecimals: number,
    liquiditySelection: LiquiditySelection
  ): Promise<SorReturn> {
    console.log(
      `[SorManager] getBestSwap: ${tokenIn}/${tokenOut} (Liq: ${liquiditySelection}) (V1: ${this.isV1Supported})`
    );

    const v2TokenIn = tokenIn === NATIVE_ASSET_ADDRESS ? AddressZero : tokenIn;
    const v2TokenOut =
      tokenOut === NATIVE_ASSET_ADDRESS ? AddressZero : tokenOut;

    const timestampSeconds = Math.floor(Date.now() / 1000);

    // The poolTypeFilter can be used to filter to different pool types. Useful for debug/testing.
    const swapOptions: SwapOptions = {
      maxPools: this.maxPools,
      gasPrice: this.gasPrice,
      swapGas: BigNumber.from(SWAP_COST),
      poolTypeFilter: PoolFilter.All,
      timestamp: timestampSeconds,
      forceRefresh: true,
      boostedPools: beethovenxService.getCachedConfig().boostedPools
    };

    const swapInfoV2: SwapInfo = await beethovenxService.sorGetSwaps({
      tokenIn: v2TokenIn.toLowerCase(),
      tokenOut: v2TokenOut.toLowerCase(),
      swapType: swapType === SwapTypes.SwapExactIn ? 'EXACT_IN' : 'EXACT_OUT',
      swapAmount: amountNormalized.toString(),
      swapOptions: {
        forceRefresh: true,
        timestamp: timestampSeconds
      }
    });

    // Both are scaled amounts
    console.log(
      `[SorManager] ${swapInfoV2.returnAmount.toString()}: V2 return amount`
    );
    console.log(
      `[SorManager] ${swapInfoV2.returnAmountConsideringFees.toString()}: V2 return amount with fees`
    );

    if (swapType === SwapTypes.SwapExactIn) {
      return this.selectBestSwapIn(
        BigNumber.from('0'),
        BigNumber.from('0'),
        new OldBigNumber(0),
        [],
        swapInfoV2,
        tokenIn,
        tokenInDecimals,
        tokenOut,
        tokenOutDecimals,
        liquiditySelection
      );
    } else {
      return this.selectBestSwapOut(
        BigNumber.from('0'),
        BigNumber.from('0'),
        new OldBigNumber(0),
        [],
        swapInfoV2,
        tokenIn,
        tokenInDecimals,
        tokenOut,
        tokenOutDecimals,
        liquiditySelection
      );
    }
  }

  private selectBestSwapIn(
    returnAmountV1: BigNumber,
    returnAmountV1ConsideringFees: BigNumber,
    marketSpV1Scaled: OldBigNumber,
    swapsV1: Swap[][],
    swapInfoV2: SwapInfo,
    tokenIn: string,
    tokenInDecimals: number,
    tokenOut: string,
    tokenOutDecimals: number,
    liquiditySelection: LiquiditySelection
  ): SorReturn {
    // For swapExactIn the highest return is best

    const v2return: SorReturn = {
      isV1swap: false,
      isV1best: false,
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      returnDecimals: tokenOutDecimals,
      hasSwaps: swapInfoV2.swaps.length > 0,
      returnAmount: swapInfoV2.returnAmount,
      v1result: [swapsV1, returnAmountV1, marketSpV1Scaled],
      v2result: swapInfoV2,
      marketSpNormalised: swapInfoV2.marketSp
    };

    console.log('[SorManager] V2 swap is best by liq.');
    this.selectedPools = this.sorV2.getPools();
    return v2return;
  }

  private selectBestSwapOut(
    returnAmountV1: BigNumber,
    returnAmountV1ConsideringFees: BigNumber,
    marketSpV1Scaled: OldBigNumber,
    swapsV1: Swap[][],
    swapInfoV2: SwapInfo,
    tokenIn: string,
    tokenInDecimals: number,
    tokenOut: string,
    tokenOutDecimals: number,
    liquiditySelection: LiquiditySelection
  ): SorReturn {
    // swapExactOut cases
    // For swapExactOut the lowest return is best if > 0

    const v2return: SorReturn = {
      isV1swap: false,
      isV1best: false,
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      returnDecimals: tokenInDecimals,
      hasSwaps: swapInfoV2.swaps.length > 0,
      returnAmount: swapInfoV2.returnAmount,
      v1result: [swapsV1, returnAmountV1, marketSpV1Scaled],
      v2result: swapInfoV2,
      marketSpNormalised: swapInfoV2.marketSp
    };

    this.selectedPools = this.sorV2.getPools();
    return v2return;
  }

  // Check if pool info fetch
  hasPoolData(): boolean {
    return true;
  }
}
