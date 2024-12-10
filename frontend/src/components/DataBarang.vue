<script setup>
import { ref, onMounted, computed } from "vue";

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
    listBarangMasuk.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getDataKeluar() {
  try {
    const response = await fetch(`http://localhost:3000/api/barangkeluar`);
    const data = await response.json();
    listBarangKeluar.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Format angka ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};

// Gabungkan dan hitung jumlah stok
const combinedData = computed(() => {
  const dataMasuk = listBarangMasuk.value;
  const dataKeluar = listBarangKeluar.value;

  return dataMasuk.map((item) => ({
    ...item,
    stok: item.stok - dataKeluar.find((i) => i.kode_barang === item.kode_barang)?.jumlah || item.stok,
  }));
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl mb-3 font-bold italic">Data Barang</h1>
    <div>
      <!-- Table -->
      <table
        class="w-full border-collapse border border-gray-300 shadow-lg rounded-md overflow-hidden"
      >
        <thead>
          <tr
            class="bg-purple-600 text-left text-sm font-semibold text-white uppercase tracking-wide"
          >
            <th class="py-3 px-4 border-b border-gray-300">No</th>
            <th class="py-3 px-4 border-b border-gray-300">Kode Barang</th>
            <th class="py-3 px-4 border-b border-gray-300">Nama Barang</th>
            <th class="py-3 px-4 border-b border-gray-300">Jumlah Stok</th>
            <th class="py-3 px-4 border-b border-gray-300">Harga</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in combinedData"
            :key="item.id"
            class="hover:bg-gray-50"
          >
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
            <td class="py-2 px-4 border-b border-gray-200 text-gray-700">
              {{ rupiah(item.harga) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-5">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 mx-1 text-white bg-blue-500 hover:bg-gray-500 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <div>
          <span v-for="page in totalPages" :key="page">
            <button
              @click="goToPage(page)"
              :class="[
                'px-4 py-2 mx-1 rounded',
                page === currentPage
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300',
              ]"
            >
              {{ page }}
            </button>
          </span>
        </div>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 mx-1 text-white bg-blue-500 hover:bg-gray-500 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
