import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { View, Hide } from '@element-plus/icons-vue' // 新增导入

const app = createApp(App)
// 全局注册带前缀的图标组件
app.component('ElIconView', View)
app.component('ElIconHide', Hide)

app.use(router)
app.use(ElementPlus)
app.mount('#app')


