// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import 'bootstrap/dist/css/bootstrap.css';
import 'toastr/build/toastr.min.css';
import VueResource from 'vue-resource';
import Vue from 'vue';
import App from './App';
import router from './router';


window.$ = window.jQuery = require('jquery'); // eslint-disable-line
require('bootstrap');
const toastr = require('toastr');

toastr.options.timeOut = 2000; // 2 sec

Vue.use(VueResource);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
