import './assets/main.css'
import sample from './plugins/sample'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import * as Api from '../src/plugins/api/index'
const app = createApp(App)

app.use(router)
// app.provide('api', Api)
app.use(sample)

console.log(app)

app.mount('#app')
