import './assets/main.css'
import sample from './plugins/sample'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
const app = createApp(App)
app.use(router)
app.use(sample)
app.mount('#app')
