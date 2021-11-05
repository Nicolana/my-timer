import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './styles/tailwind.css';
import './styles/global.css';

const app = createApp(App);
app.use(ElementPlus);
app.use(store)
  .use(router)
  .mount('#app');
