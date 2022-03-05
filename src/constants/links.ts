export const EXTERNAL_LINKS = {
  Balancer: {
    Home: 'https://balancer.fi',
    BalForGas:
      'https://docs.balancer.finance/core-concepts/bal-balancer-governance-token/bal-for-gas',
    PoolsV1Dashboard: 'https://pools.balancer.exchange/#/dashboard',
    PoolsV1Explore: 'https://pools.balancer.exchange/#/explore'
  },
  Gauntlet: {
    Home: 'https://gauntlet.network'
  },
  Ethereum: {
    Wallets: 'https://fantom.foundation/wallets/'
  },
  Element: {
    Earn: 'https://app.element.fi/earn',
    Pools: {
      LUSD:
        'https://app.element.fi/pools/0xA8D4433BAdAa1A35506804B43657B0694deA928d',
      USDC:
        'https://app.element.fi/pools/0x787546Bf2c05e3e19e2b6BDE57A203da7f682efF'
    }
  },
  Copper: {
    Auctions: (poolAddress: string, networkPrefix = '') =>
      `https://${networkPrefix}copperlaunch.com/auctions/${poolAddress}`
  },
  Beethoven: {
    NavOtherItems: [
      {
        title: 'Vote',
        subTitle: '',
        url: 'https://snapshot.org/#/beets.eth'
      },
      {
        title: 'Analytics',
        subTitle: '',
        url: 'https://info.beets.fi'
      },
      {
        title: 'Docs & Help',
        subTitle: '',
        url: 'https://docs.beethovenx.io"'
      },
      {
        title: 'Github',
        subTitle: '',
        url: 'https://github.com/beethovenxfi'
      },
      {
        title: 'Twitter',
        subTitle: '',
        url: 'https://twitter.com/beethoven_x'
      },
      {
        title: 'Medium',
        subTitle: '',
        url: 'https://beethovenxio.medium.com/'
      },
      {
        title: 'Discord',
        subTitle: '',
        url: 'https://discord.gg/jedS4zGk28'
      },
      {
        title: 'Multichain Bridge',
        subTitle: 'ETH / AVAX / BSC / MATIC',
        url: 'https://app.multichain.org/#/router'
      },
      {
        title: 'AllBridge',
        subTitle: 'SOL / MATIC / CELO',
        url: 'https://app.allbridge.io/bridge?from=SOL&to=FTM&asset=SOL'
      }
    ]
  }
};
