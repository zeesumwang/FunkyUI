import { createApp } from 'vue'
import App from './App.vue'

// const pageView = document.createElement('flutter-page-view');
// pageView.appendChild(App)
const myApp = createApp(App)
myApp.mount(document.body)