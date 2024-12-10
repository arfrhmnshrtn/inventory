<script setup>
import { ref, onMounted } from "vue";

onMounted(() => {
  getDataMasuk();
  getDataKeluar();
});

const listBarangMasuk = ref([]);
const listBarangKeluar = ref([]);

async function getDataMasuk() {
  try {
    const response = await fetch(`http://localhost:3000/api/inventory`);
    const data = await response.json();
    listBarangMasuk.value = data.slice(0, 5);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getDataKeluar() {
  try {
    const response = await fetch(`http://localhost:3000/api/barangkeluar`);
    const data = await response.json();
    listBarangKeluar.value = data.slice(0, 5);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- info jumlah -->
    <div class="flex flex-wrap justify-between gap-4">
      <div
        class="flex justify-between items-center bg-blue-500 rounded-lg p-4 text-white w-full sm:w-full md:w-[48%] lg:w-[32%]"
      >
        <div>
          <h1 class="text-5xl">{{ listBarangMasuk.length }}</h1>
          <p>Data Barang</p>
        </div>
        <div class="text-5xl text-black opacity-30">
          <font-awesome-icon :icon="['far', 'calendar-days']" />
        </div>
      </div>
      <div
        class="flex justify-between items-center bg-red-500 rounded-lg p-4 text-white w-full sm:w-full md:w-[48%] lg:w-[32%]"
      >
        <div>
          <h1 class="text-5xl">{{ listBarangMasuk.length }}</h1>
          <p>Barang Masuk</p>
        </div>
        <div class="text-5xl text-black opacity-30">
          <font-awesome-icon :icon="['fas', 'cart-plus']" />
        </div>
      </div>
      <div
        class="flex justify-between items-center bg-green-500 rounded-lg p-4 text-white w-full sm:w-full md:w-[48%] lg:w-[32%]"
      >
        <div>
          <h1 class="text-5xl">{{ listBarangKeluar.length }}</h1>
          <p>Barang Keluar</p>
        </div>
        <div class="text-5xl text-black opacity-30">
          <font-awesome-icon :icon="['fas', 'notes-medical']" />
        </div>
      </div>
    </div>

    <!-- info barang -->
    <div class="mt-10 flex flex-wrap gap-10">
      <div class="bg-slate-100 p-3 rounded-lg w-full sm:w-full md:w-[48%]">
        <h2 class="text-xl mb-3">Barang Masuk Bulan Ini</h2>
        <table class="w-full">
          <thead>
            <tr
              class="bg-red-500 text-left text-sm font-semibold text-white uppercase tracking-wide"
            >
              <th class="py-3 px-4 border-b border-gray-300">No</th>
              <th class="py-3 px-4 border-b border-gray-300">Kode Barang</th>
              <th class="py-3 px-4 border-b border-gray-300">Nama Barang</th>
              <th class="py-3 px-4 border-b border-gray-300">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in listBarangMasuk" :key="index">
              <td class="py-2 px-4 border-b border-gray-200 text-gray-700">
                {{ index + 1 }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 text-gray-700">
                {{ item.kode_barang }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 text-gray-700">
                {{ item.nama_barang }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 text-gray-700">
                {{ item.stok }}
              </td>
            </tr>
            <tr>
              <button class="bg-blue-500 text-white py-1 px-5 mt-5 rounded">
                <router-link to="/barangmasuk">Lihat Semua</router-link>
              </button>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-slate-100 p-3 rounded-lg w-full sm:w-full md:w-[48%]">
        <h2 class="text-xl mb-3">Barang Keluar Bulan Ini</h2>
        <table class="w-full">
          <thead>
            <tr
              class="bg-green-500 text-white text-left text-sm font-semibold uppercase tracking-wide"
            >
              <th class="py-3 px-4 border-b border-gray-300">No</th>
              <th class="py-3 px-4 border-b border-gray-300">Kode Barang</th>
              <th class="py-3 px-4 border-b border-gray-300">Nama Barang</th>
              <th class="py-3 px-4 border-b border-gray-300">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in listBarangKeluar" :key="index">
              <td class="py-2 px-4 border-b border-gray-200 text-gray-700">
                {{ index + 1 }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 text-gray-700">
                {{ item.kode_barang }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 text-gray-700">
                {{ item.nama_barang }}
              </td>
              <td class="py-2 px-4 border-b border-gray-200 text-gray-700">
                {{ item.jumlah }}
              </td>
            </tr>
            <tr>
              <button class="bg-blue-500 text-white py-1 px-5 mt-5 rounded">
                <router-link to="/barangkeluar">Lihat Semua</router-link>
              </button>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
