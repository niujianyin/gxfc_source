import Vue from 'vue';
import VueRouter from 'vue-router';
var VueTouch = require('vue-touch');
import App from './App';
import index from 'components/index/index';
import review from 'components/review/review';
import detail from 'components/detail/detail';

// 直接引入静态样式
import 'common/css/reset.css';
import 'common/stylus/base.styl';
import 'common/js/lib.js';

Vue.use(VueRouter);
Vue.use(VueTouch);

let app = Vue.extend(App);

let router = new VueRouter({
  linkActiveClass: 'active'
});
router.map({
  '/': {
    component: index
  },
  '/history/:lottId': {
    component: review
  },
  '/detail/:lottId/:issueno': {
    component: detail
  }
});
router.redirect({
  '*': '/'
})
router.start(app, '#app');
