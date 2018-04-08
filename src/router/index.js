import Vue from 'vue'
import Router from 'vue-router'
import Goods from '@/components/goods/Goods'
import Comments from '@/components/comments/Comments'
import Seller from '@/components/seller/Seller'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/goods'
  }, {
    path: '/goods',
    name: 'Goods',
    component: Goods
  }, {
    path: '/comments',
    name: 'Comments',
    component: Comments
  }, {
    path: '/seller',
    name: 'Seller',
    component: Seller
  }],
  linkActiveClass: 'active'
})
