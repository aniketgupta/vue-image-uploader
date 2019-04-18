// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import 'bootstrap/dist/css/bootstrap.css';
import 'toastr/build/toastr.min.css';
import 'font-awesome/css/font-awesome.css';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';


window.$ = window.jQuery = require('jquery'); // eslint-disable-line
require('bootstrap');
const toastr = require('toastr');

toastr.options.timeOut = 30000; // 30 sec

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
});
