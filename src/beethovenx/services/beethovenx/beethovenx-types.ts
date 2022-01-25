export interface UserPortfolioData {
  timestamp: number;
  totalValue: number;
  totalSwapFees: number;
  totalSwapVolume: number;
  myFees: number;

  pools: UserPoolData[];
  tokens: UserTokenData[];
}

export interface UserPoolData {
  id: string;
  poolId: string;
  poolAddress: string;
  name: string;
  shares: number;
  percentShare: number;
  totalValue: number;
  pricePerShare: number;
  tokens: UserTokenData[];
  swapFees: number;
  swapVolume: number;
  myFees: number;
  percentOfPortfolio: number;
  priceChange: number;
  priceChangePercent: number;
}

export interface UserTokenData {
  id: string;
  address: string;
  symbol: string;
  name: string;
  balance: number;
  pricePerToken: number;
  totalValue: number;
  percentOfPortfolio: number;
}

export interface UserPortfolio {
  portfolio: UserPortfolioData;
  history: UserPortfolioData[];
}

interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Binary: any;
  Date: any;
  Datetime: any;
  GqlBigNumber: string;
  JSON: any;
  UUID: string;
  BigDecimal: string;
  BigInt: string;
  Bytes: string;
}

export interface GqlUserPoolData {
  __typename?: 'GqlUserPoolData';
  id: Scalars['String'];
  myFees: Scalars['GqlBigNumber'];
  name: Scalars['String'];
  percentOfPortfolio: Scalars['Float'];
  percentShare: Scalars['Float'];
  poolAddress: Scalars['String'];
  poolId: Scalars['String'];
  priceChange: Scalars['GqlBigNumber'];
  priceChangePercent: Scalars['Float'];
  pricePerShare: Scalars['GqlBigNumber'];
  shares: Scalars['GqlBigNumber'];
  swapFees: Scalars['GqlBigNumber'];
  swapVolume: Scalars['GqlBigNumber'];
  tokens: Array<GqlUserTokenData>;
  totalValue: Scalars['GqlBigNumber'];
}

export interface GqlUserPortfolioData {
  __typename?: 'GqlUserPortfolioData';
  myFees: Scalars['GqlBigNumber'];
  pools: Array<GqlUserPoolData>;
  timestamp: Scalars['Int'];
  tokens: Array<GqlUserTokenData>;
  totalSwapFees: Scalars['GqlBigNumber'];
  totalSwapVolume: Scalars['GqlBigNumber'];
  totalValue: Scalars['GqlBigNumber'];
}

export interface GqlUserTokenData {
  __typename?: 'GqlUserTokenData';
  address: Scalars['String'];
  balance: Scalars['GqlBigNumber'];
  id: Scalars['String'];
  name: Scalars['String'];
  percentOfPortfolio: Scalars['Float'];
  pricePerToken: Scalars['GqlBigNumber'];
  symbol: Scalars['String'];
  totalValue: Scalars['GqlBigNumber'];
}

export interface GqlHistoricalTokenPrice {
  __typename?: 'GqlHistoricalTokenPrice';
  address: Scalars['String'];
  prices: Array<GqlHistoricalTokenPriceEntry>;
}

export interface GqlHistoricalTokenPriceEntry {
  __typename?: 'GqlHistoricalTokenPriceEntry';
  price: Scalars['Float'];
  timestamp: Scalars['String'];
}

export interface GqlTokenPrice {
  __typename?: 'GqlTokenPrice';
  address: Scalars['String'];
  price: Scalars['Float'];
}

export interface GqlLgeCreateInput {
  id: Scalars['ID'];
  address: Scalars['String'];
  bannerImageUrl: Scalars['String'];
  collateralAmount: Scalars['String'];
  collateralEndWeight: Scalars['Int'];
  collateralStartWeight: Scalars['Int'];
  collateralTokenAddress: Scalars['String'];
  description: Scalars['String'];
  discordUrl: Scalars['String'];
  endDate: Scalars['String'];
  mediumUrl: Scalars['String'];
  name: Scalars['String'];
  startDate: Scalars['String'];
  swapFeePercentage: Scalars['String'];
  telegramUrl: Scalars['String'];
  tokenAmount: Scalars['String'];
  tokenContractAddress: Scalars['String'];
  tokenEndWeight: Scalars['Int'];
  tokenIconUrl: Scalars['String'];
  tokenStartWeight: Scalars['Int'];
  twitterUrl: Scalars['String'];
  websiteUrl: Scalars['String'];
}

export interface GqlLge {
  __typename?: 'GqlLge';
  address: Scalars['String'];
  bannerImageUrl: Scalars['String'];
  collateralAmount: Scalars['String'];
  collateralEndWeight: Scalars['Int'];
  collateralStartWeight: Scalars['Int'];
  collateralTokenAddress: Scalars['String'];
  description: Scalars['String'];
  discordUrl: Scalars['String'];
  endDate: Scalars['String'];
  id: Scalars['ID'];
  mediumUrl: Scalars['String'];
  name: Scalars['String'];
  startDate: Scalars['String'];
  swapFeePercentage: Scalars['String'];
  telegramUrl: Scalars['String'];
  tokenAmount: Scalars['String'];
  tokenContractAddress: Scalars['String'];
  tokenEndWeight: Scalars['Int'];
  tokenIconUrl: Scalars['String'];
  tokenStartWeight: Scalars['Int'];
  twitterUrl: Scalars['String'];
  websiteUrl: Scalars['String'];
  adminAddress: Scalars['String'];
  adminIsMultisig: Scalars['Boolean'];
}

export const CreateLgeTypes = {
  CreateLge: [
    { name: 'id', type: 'string' },
    { name: 'address', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'tokenContractAddress', type: 'string' },
    { name: 'collateralTokenAddress', type: 'string' },
    { name: 'tokenAmount', type: 'string' },
    { name: 'collateralAmount', type: 'string' },
    { name: 'tokenStartWeight', type: 'int' },
    { name: 'tokenEndWeight', type: 'int' },
    { name: 'collateralStartWeight', type: 'int' },
    { name: 'collateralEndWeight', type: 'int' },
    { name: 'swapFeePercentage', type: 'string' },
    { name: 'tokenIconUrl', type: 'string' },
    { name: 'bannerImageUrl', type: 'string' },
    { name: 'websiteUrl', type: 'string' },
    { name: 'telegramUrl', type: 'string' },
    { name: 'twitterUrl', type: 'string' },
    { name: 'discordUrl', type: 'string' },
    { name: 'mediumUrl', type: 'string' },
    { name: 'startDate', type: 'string' },
    { name: 'endDate', type: 'string' }
  ]
};

export interface GqlBeetsProtocolData {
  __typename?: 'GqlBeetsProtocolData';
  beetsPrice: Scalars['BigDecimal'];
  circulatingSupply: Scalars['BigDecimal'];
  marketCap: Scalars['BigDecimal'];
  poolCount: Scalars['BigInt'];
  totalLiquidity: Scalars['BigDecimal'];
  totalSwapFee: Scalars['BigDecimal'];
  totalSwapVolume: Scalars['BigDecimal'];
  swapFee24h: Scalars['BigDecimal'];
  swapVolume24h: Scalars['BigDecimal'];
}

export interface GqlBalancerPoolSnapshot {
  __typename?: 'GqlBalancerPoolSnapshot';
  id: Scalars['ID'];
  liquidityChange24h: Scalars['BigDecimal'];
  poolId: Scalars['ID'];
  swapFees24h: Scalars['BigDecimal'];
  swapVolume24h: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  tokens: Array<GqlBalancerPoolToken>;
  totalLiquidity: Scalars['BigDecimal'];
  totalShares: Scalars['BigDecimal'];
  totalSwapFee: Scalars['BigDecimal'];
  totalSwapVolume: Scalars['BigDecimal'];
}

export interface GqlBalancerPoolToken {
  __typename?: 'GqlBalancerPoolToken';
  address: Scalars['String'];
  balance: Scalars['BigDecimal'];
}

export interface GqlBeetsFarm {
  __typename?: 'GqlBeetsFarm';
  allocPoint: Scalars['Int'];
  block: Scalars['BigInt'];
  id: Scalars['ID'];
  lastRewardBlock: Scalars['BigInt'];
  masterChef: GqlBeetsMasterChef;
  pair: Scalars['Bytes'];
  rewarder?: GqlBeetsRewarder;
  slpBalance: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  userCount: Scalars['BigInt'];
}

export interface GqlBeetsFarmUser {
  __typename?: 'GqlBeetsFarmUser';
  address: Scalars['Bytes'];
  amount: Scalars['BigInt'];
  beetsHarvested: Scalars['BigInt'];
  farmId: Scalars['ID'];
  id: Scalars['ID'];
  rewardDebt: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
}

export interface GqlBeetsMasterChef {
  __typename?: 'GqlBeetsMasterChef';
  beetsPerBlock: Scalars['BigInt'];
  id: Scalars['ID'];
  totalAllocPoint: Scalars['Int'];
}

export interface GqlBeetsRewarder {
  __typename?: 'GqlBeetsRewarder';
  id: Scalars['ID'];
  rewardPerSecond: Scalars['BigInt'];
  rewardToken: Scalars['Bytes'];
  tokens: Array<GqlBeetsRewarderToken>;
}

export interface GqlBeetsRewarderToken {
  __typename?: 'GqlBeetsRewarderToken';
  rewardPerSecond: Scalars['BigInt'];
  symbol: Scalars['String'];
  token: Scalars['Bytes'];
  tokenPrice: Scalars['Float'];
}

export interface GqlBeetsConfig {
  __typename?: 'GqlBeetsConfig';
  blacklistedPools: Array<Scalars['String']>;
  featuredPools: Array<Scalars['String']>;
  homeFeaturedPools: Array<GqlBeetsConfigFeaturedPool>;
  homeNewsItems: Array<GqlBeetsConfigNewsItem>;
  incentivizedPools: Array<Scalars['String']>;
  pausedPools: Array<Scalars['String']>;
  poolFilters: Array<GqlBeetsConfigPoolFilterItem>;
}

export interface GqlBeetsConfigFeaturedPool {
  __typename?: 'GqlBeetsConfigFeaturedPool';
  description?: Scalars['String'];
  image: Scalars['String'];
  poolId: Scalars['String'];
}

export interface GqlBeetsConfigNewsItem {
  __typename?: 'GqlBeetsConfigNewsItem';
  description: Scalars['String'];
  image: Scalars['String'];
  title: Scalars['String'];
  url: Scalars['String'];
  publishDate: Scalars['String'];
}

export interface GqlBeetsConfigPoolFilterItem {
  __typename?: 'GqlBeetsConfigPoolFilterItem';
  id: Scalars['ID'];
  pools: Array<Scalars['String']>;
  title: Scalars['String'];
}

export interface GqlBalancePoolApr {
  __typename?: 'GqlBalancePoolApr';
  beetsApr: Scalars['BigDecimal'];
  hasRewardApr: Scalars['Boolean'];
  items: Array<GqlBalancePoolAprItem>;
  swapApr: Scalars['BigDecimal'];
  thirdPartyApr: Scalars['BigDecimal'];
  total: Scalars['BigDecimal'];
}

export interface GqlBalancePoolAprItem {
  __typename?: 'GqlBalancePoolAprItem';
  apr: Scalars['BigDecimal'];
  subItems?: Array<GqlBalancePoolAprSubItem>;
  title: Scalars['String'];
}

export interface GqlBalancePoolAprSubItem {
  __typename?: 'GqlBalancePoolAprSubItem';
  apr: Scalars['BigDecimal'];
  title: Scalars['String'];
}
