import "./assets/main.css"
import "vue-connect-wallet/dist/style.css"
import { ConnectWalletButton } from "vue-connect-wallet"
import { createApp } from "vue"
import PrimeVue from "primevue/config"
import Aura from "@primevue/themes/aura"
import Button from "primevue/button"
import App from "./App.vue"
import router from "./router"

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});

app.use(router)

// eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
app.component("Button", Button)
app.component("ConnectWalletButton", ConnectWalletButton)

app.mount("#app")
