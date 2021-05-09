import { TransactionResponse } from '@ethersproject/abstract-provider';
import { getInstance } from '@snapshot-labs/lock/plugins/vue3';
import configs from '@/config';
import { callStatic, sendTransaction } from '@/utils/balancer/web3';
import { default as vaultAbi } from '@/abi/Vault.json';
import { default as helpersAbi } from '@/abi/BalancerHelpers.json';
import { Token } from '@/types';
import JoinParams from './serializers/JoinParams';
import ExitParams from './serializers/ExitParams';
import { FullPool } from '@/services/balancer/subgraph/types';

export default class Exchange {
  pool: FullPool;
  network: string;
  vaultAddress: string;
  helpersAddress: string;
  tokens: Token[];

  constructor(pool: FullPool, network: string, tokens: Token[]) {
    this.pool = pool;
    this.network = network;
    this.tokens = tokens;
    this.vaultAddress = configs[network].addresses.vault;
    this.helpersAddress = configs[network].addresses.balancerHelpers;
  }

  public async queryJoin(account: string, amountsIn: string[], bptOut = '0') {
    const txParams = this.joinParams.serialize(account, amountsIn, bptOut);

    return await callStatic(
      this.provider,
      this.helpersAddress,
      helpersAbi,
      'queryJoin',
      txParams
    );
  }

  public async getUserBalance(account: string, addresses: string[]) {
    return await callStatic(
      this.provider,
      this.vaultAddress,
      vaultAbi,
      'getInternalBalance',
      [account, addresses]
    );
  }

  public async join(
    account: string,
    amountsIn: string[],
    bptOut = '0',
    fromUserBalance = false
  ): Promise<TransactionResponse> {
    const txParams = this.joinParams.serialize(
      account,
      amountsIn,
      bptOut,
      fromUserBalance
    );

    return await sendTransaction(
      this.provider,
      this.vaultAddress,
      vaultAbi,
      'joinPool',
      txParams
    );
  }

  public async queryExit(
    account: string,
    amountsOut: string[],
    bptIn: string,
    exitTokenIndex: number | null,
    exactOut: boolean
  ) {
    const txParams = this.exitParams.serialize(
      account,
      amountsOut,
      bptIn,
      exitTokenIndex,
      exactOut
    );

    return await callStatic(
      this.provider,
      this.helpersAddress,
      helpersAbi,
      'queryExit',
      txParams
    );
  }

  public async exit(
    account: string,
    amountsOut: string[],
    bptIn: string,
    exitTokenIndex: number | null,
    exactOut: boolean,
    toUserBalance = false
  ): Promise<TransactionResponse> {
    const txParams = this.exitParams.serialize(
      account,
      amountsOut,
      bptIn,
      exitTokenIndex,
      exactOut,
      toUserBalance
    );

    return await sendTransaction(
      this.provider,
      this.vaultAddress,
      vaultAbi,
      'exitPool',
      txParams
    );
  }

  public get provider() {
    const { web3 } = getInstance();
    return web3;
  }

  private get joinParams() {
    return new JoinParams(this);
  }

  private get exitParams() {
    return new ExitParams(this);
  }
}
