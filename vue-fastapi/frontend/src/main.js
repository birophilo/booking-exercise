import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import StoreSelectionPage from './views/StoreSelectionPage.vue'
import BookingPage from './views/BookingPage.vue'
import ConfirmationPage from './views/ConfirmationPage.vue'
import './assets/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: StoreSelectionPage },
    { path: '/booking', component: BookingPage },
    { path: '/confirmation', component: ConfirmationPage }
  ]
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app') 