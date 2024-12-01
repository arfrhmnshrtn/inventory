import { createRouter, createWebHistory } from "vue-router";
import Masuk from "../components/Masuk.vue";
import Keluar from "../components/Keluar.vue";
import Dasboard from "../components/Dasboard.vue";
import DataBarang from "../components/DataBarang.vue";

const routes = [
  {
    path: "/",
    name: "Dasboard",
    component: Dasboard,
  },
  {
    path: "/barangkeluar",
    name: "Barang Keluar",
    component: Keluar,
  },
  {
    path: "/barangmasuk",
    name: "Barang Masuk",
    component: Masuk,
  },
  {
    path: "/databarang",
    name: "Data Barang",
    component: DataBarang,
  },
];

const router = createRouter({
  //   activeClass: "text-blue-500",
  history: createWebHistory(), // gunakan HTML5 history mode
  routes,
});

export default router;
