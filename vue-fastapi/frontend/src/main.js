import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import BookingPage from './views/BookingPage.vue'
import ConfirmationPage from './views/ConfirmationPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: BookingPage },
    { path: '/confirmation', component: ConfirmationPage }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app') 