import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import PoolPage from '@/beethovenx/pages/pool/_id.vue';
import PoolInvestPage from '@/beethovenx/pages/pool/invest.vue';
import PoolWithdrawPage from '@/beethovenx/pages/pool/withdraw.vue';
import LiquidityMiningPage from '@/pages/liquidity-mining.vue';
import TradePage from '@/beethovenx/pages/trade.vue';
import PoolCreate from '@/beethovenx/pages/PoolCreate.vue';
import Portfolio from '@/beethovenx/pages/Portfolio.vue';
import FreshBeets from '@/beethovenx/pages/FreshBeets.vue';
import LbpCreate from '@/beethovenx/pages/lbp/LgeCreate.vue';
import LgeList from '@/beethovenx/pages/lbp/LgeList.vue';
import LbpDetail from '@/beethovenx/pages/lbp/LgeDetail.vue';
import HomePage from '@/beethovenx/pages/Home.vue';
import InvestPage from '@/beethovenx/pages/Invest.vue';
import Lock from '@/beethovenx/pages/Lock.vue';
import LinearPools from '@/beethovenx/pages/LinearPools.vue';
import { configService } from '@/services/config/config.service';

const { featureFlags } = configService;

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
  {
    path: '/',
    name: 'home',
    component: HomePage,
    beforeEnter() {
      window.location.href = 'https://op.beets.fi';
    }
  }
  // {
  //   path: '/trade/:assetIn?/:assetOut?',
  //   name: 'trade',
  //   component: TradePage
  // },
  // {
  //   path: '/swap/:assetIn?/:assetOut?',
  //   redirect: to => {
  //     return `/trade${to.path.split('/swap')[1]}`;
  //   }
  // },
  // {
  //   path: '/pool/:id',
  //   name: 'pool',
  //   component: PoolPage
  // },
  // {
  //   path: '/pool/:id/invest',
  //   name: 'invest',
  //   component: PoolInvestPage,
  //   meta: { layout: 'PoolTransferLayout' }
  // },
  // {
  //   path: '/pool/:id/withdraw',
  //   name: 'withdraw',
  //   component: PoolWithdrawPage,
  //   meta: { layout: 'PoolTransferLayout' }
  // },
  // {
  //   path: '/liquidity-mining',
  //   name: 'liquidity-mining',
  //   component: LiquidityMiningPage
  // },
  // { path: '/pools', name: 'pools', component: InvestPage },
  // { path: '/pool-create', name: 'pool-create', component: PoolCreate },
  // // { path: '/my-portfolio', name: 'my-portfolio', component: Portfolio },
  // { path: '/stake', name: 'stake', component: FreshBeets },
  // // { path: '/lge-create', name: 'lge-create', component: LbpCreate },
  // { path: '/launch', name: 'launch', component: LgeList },
  // { path: '/lge/:id', name: 'lge', component: LbpDetail },
  // { path: '/linear-pools', name: 'linear-pools', component: LinearPools },
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'not-found',
  //   redirect: '/'
  // }
];

if (featureFlags.supportsMasterChef) {
  routes.push({ path: '/stake', name: 'stake', component: FreshBeets });
}
if (featureFlags.hasLbpLaunch) {
  routes.push(
    { path: '/launch', name: 'launch', component: LgeList },
    { path: '/lge/:id', name: 'lge', component: LbpDetail },
    { path: '/lge-create', name: 'lge-create', component: LbpCreate }
  );
}

/**
 * DEV/STAGING ONLY ROUTES
 */
if (
  ['development', 'staging'].includes(process.env.VUE_APP_ENV || 'development')
) {
  routes.push({ path: '/lock', name: 'lock', component: Lock });
}

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
