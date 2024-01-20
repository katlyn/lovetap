import "./assets/main.css"

import { defaultConfig as formkitDefaultConfig,plugin as formkitPlugin } from "@formkit/vue"
import { createApp } from "vue"

import formkitConfig from "@/formkit.config"

import App from "./App.vue"
import router from "./router"

const app = createApp(App)

app.use(router)
app.use(formkitPlugin, formkitDefaultConfig(formkitConfig()))

app.mount("#app")

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === "production" ? "/service-worker.js" : "/dev-sw.js?dev-sw"
  )
}
