import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Startet die Vue-Anwendung im HTML-Element mit der ID app
createApp(App).use(router).mount('#app')
