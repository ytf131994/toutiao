import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './style/index.less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { ElementTiptapPlugin } from 'element-tiptap'
import 'element-tiptap/lib/index.css'
Vue.use(ElementTiptapPlugin, {
    lang: 'zh', // 见 i18n
    spellcheck: true // 可被 editor 同名 prop 重写
})
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(ElementUI)
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
