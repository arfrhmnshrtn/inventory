import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import router from "./router/router";

// font awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Import ikon yang dibutuhkan
import { fas } from "@fortawesome/free-solid-svg-icons"; // Semua ikon solid
import { far } from "@fortawesome/free-regular-svg-icons"; // Semua ikon regular
import { fab } from "@fortawesome/free-brands-svg-icons"; // Semua ikon brand


// Tambahkan ikon ke library
library.add(fas, far, fab);

const app = createApp(App);

// Daftarkan komponen Font Awesome
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(router); // Gunakan router

app.mount("#app");
