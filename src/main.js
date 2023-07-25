import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import { resolve, join } from '@tauri-apps/api/path';
// import "./utils/acs-2060"
import "./utils/BDfyApIndex"
import { APIgetBaiDuFnYiCookieID } from './request'
import { analysisBaiDuFnYitoken } from "./utils/index"
window.__appDir = await resolve()
window.__defaultTrainers = await join(window.__appDir, 'Trainers')

createApp(App).mount("#app");

if (!window.BdFanYi_tk) {
    APIgetBaiDuFnYiCookieID().then((d) => {
        analysisBaiDuFnYitoken(d)
    })
}


