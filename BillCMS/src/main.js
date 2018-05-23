// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'

import './assets/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/elementUi.css'

Vue.config.productionTip = false;

Vue.prototype.$toast = function (title, txt='', type='success') {
    Vue.prototype.$notify({
        title: title,
        message: txt,
        type: type
    });
}
Vue.prototype.$http = axios;
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
