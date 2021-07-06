import { createApp } from 'vue'
import App from './App.vue'
import store from './assets/js/store'

require('./assets/css/global.css')

createApp(App).use(store).mount('#app')
