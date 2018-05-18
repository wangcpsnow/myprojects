// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './query.vue'
import ElementUI from 'element-ui'
import axios from 'axios'

import '../../assets/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import '../../assets/elementUi.css'

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.prototype.$http = axios;
/* eslint-disable no-new */

new Vue({
    el: '#app',
    components: { App },
    template: '<App/>'
})
