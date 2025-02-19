export interface TokenListMap {
  Balancer: {
    Default: string;
    Vetted: string;
  };
  External: string[];
}

interface TokenListMapByNetwork {
  [networkKey: string]: TokenListMap;
}

/**
 * Mapping of the TokenLists used on each network
 */
export const TOKEN_LIST_MAP: TokenListMapByNetwork = {
  '1': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/balancer-labs/assets/master/generated/listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/balancer-labs/assets/master/generated/vetted.tokenlist.json'
    },
    External: [
      'ipns://tokens.uniswap.org',
      'https://www.gemini.com/uniswap/manifest.json',
      'tokenlist.aave.eth',
      'https://umaproject.org/uma.tokenlist.json'
    ]
  },
  '42': {
    Balancer: {
      Default:
        'https://storageapi.fleek.co/balancer-team-bucket/assets/listed.tokenlist.json',
      Vetted:
        'https://storageapi.fleek.co/balancer-team-bucket/assets/vetted.tokenlist.json'
    },
    External: [
      'ipns://tokens.uniswap.org',
      // 'https://tokens.coingecko.com/uniswap/all.json',
      'https://umaproject.org/uma.tokenlist.json'
    ]
  },
  '137': {
    Balancer: {
      Default:
        'https://storageapi.fleek.co/tomafrench-team-bucket/polygon.listed.tokenlist.json',
      Vetted:
        'https://storageapi.fleek.co/tomafrench-team-bucket/polygon.vetted.tokenlist.json'
    },
    External: [
      'https://unpkg.com/quickswap-default-token-list@1.0.67/build/quickswap-default.tokenlist.json'
    ]
  },
  '42161': {
    Balancer: {
      Default:
        'https://storageapi.fleek.co/tomafrench-team-bucket/arbitrum.listed.tokenlist.json',
      Vetted:
        'https://storageapi.fleek.co/tomafrench-team-bucket/arbitrum.vetted.tokenlist.json'
    },
    External: ['https://tracer.finance/tokens']
  },
  '4': {
    Balancer: {
      Default:
        'https://beethoven-assets.s3.eu-central-1.amazonaws.com/beethoven-rinkeby.tokenlist.json',
      Vetted:
        'https://beethoven-assets.s3.eu-central-1.amazonaws.com/beethoven-rinkeby.tokenlist.json'
    },
    External: [
      'https://beethoven-assets.s3.eu-central-1.amazonaws.com/beethoven-rinkeby.tokenlist.json'
    ]
  },
  '250': {
    Balancer: {
      Default:
        'https://beethoven-assets.s3.eu-central-1.amazonaws.com/beethoven-fantom.tokenlist.json',
      Vetted:
        'https://beethoven-assets.s3.eu-central-1.amazonaws.com/beethoven-fantom.tokenlist.json'
    },
    External: [
      'https://beethoven-assets.s3.eu-central-1.amazonaws.com/beethoven-fantom.tokenlist.json'
    ]
  }
};
