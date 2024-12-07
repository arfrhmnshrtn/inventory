<script setup>
import { onMounted } from "vue";
import { initFlowbite } from "flowbite";

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite();
});

import { ref, computed } from "vue";

// Data dummy
const db = ref([
  { id: 1, nama: "Laptop", stok: 20, harga: 10000000 },
  { id: 2, nama: "Mouse", stok: 50, harga: 200000 },
  { id: 3, nama: "Keyboard", stok: 30, harga: 500000 },
  { id: 4, nama: "Monitor", stok: 15, harga: 3000000 },
  { id: 5, nama: "Printer", stok: 10, harga: 1500000 },
  { id: 6, nama: "Speaker", stok: 25, harga: 700000 },
  { id: 7, nama: "Headset", stok: 40, harga: 350000 },
  { id: 8, nama: "Webcam", stok: 18, harga: 800000 },
  { id: 9, nama: "Tablet", stok: 12, harga: 5000000 },
  { id: 10, nama: "Smartphone", stok: 30, harga: 6000000 },
]);

// Data pencarian
const searchQuery = ref("");
const filterData = ref([...db.value]);

// Fungsi pencarian
function searchData(value) {
  searchQuery.value = value;
  filterData.value = db.value.filter((item) => {
    return item.nama.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
  console.log(filterData.value);
}

// Pagination setup
const currentPage = ref(1);
const itemsPerPage = 10;

// Hitung total halaman
const totalPages = computed(() => Math.ceil(db.value.length / itemsPerPage));

// Data untuk halaman saat ini
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filterData.value.slice(start, end);
});

// Navigasi halaman
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl mb-3 font-bold italic">Data Barang Keluar:</h1>
    <div class="flex justify-between items-center">
      <div>
        <button
          data-modal-target="crud-modal"
          data-modal-toggle="crud-modal"
          class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          + Tambah Barang Keluar
        </button>
        <button
          class="bg-green-500 hover:bg-green-600 ml-3 text-white py-2 px-4 rounded"
        >
          Cetak Laporan
        </button>
      </div>
      <div class="flex items-center justify-center p-4">
        <input
          type="text"
          @input="searchData($event.target.value)"
          placeholder="Cari..."
          class="w-full max-w-md px-4 py-2 text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

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
            <th class="py-3 px-4 border-b border-gray-300">Stok</th>
            <th class="py-3 px-4 border-b border-gray-300">Harga</th>
            <th class="py-3 px-4 border-b border-gray-300 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paginatedData"
            :key="item.id"
            class="hover:bg-gray-50"
          >
            <td class="py-2 px-4 border-b border-gray-200 text-gray-700">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>
            <td class="py-2 px-4 border-b border-gray-200 text-gray-700">
              {{ item.nama }}
            </td>
            <td class="py-2 px-4 border-b border-gray-200 text-gray-700">
              {{ item.stok }}
            </td>
            <td class="py-2 px-4 border-b border-gray-200 text-gray-700">
              {{
                new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(item.harga)
              }}
            </td>
            <td class="py-2 px-4 border-b border-gray-200 text-center">
              <button
                class="px-2 py-1 mr-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"
              >
                Edit
              </button>
              <button
                class="px-2 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 mx-1 text-white bg-gray-400 hover:bg-gray-500 rounded disabled:opacity-50"
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
          class="px-4 py-2 mx-1 text-white bg-gray-400 hover:bg-gray-500 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div>
      <div>
        <!-- Main modal -->
        <div
          id="crud-modal"
          tabindex="-1"
          aria-hidden="true"
          class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div class="relative p-4 w-full max-w-md max-h-full">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <!-- Modal header -->
              <div
                class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
              >
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Tambah Barang Masuk
                </h3>
                <button
                  type="button"
                  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="crud-modal"
                >
                  <svg
                    class="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <!-- Modal body -->
              <form class="p-4 md:p-5">
                <div class="grid gap-4 mb-4 grid-cols-2">
                  <div class="col-span-2">
                    <label
                      for="name"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Name</label
                    >
                    <input
                      type="text"
                      name="name"
                      id="name"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                    />
                  </div>
                  <div class="col-span-2 sm:col-span-1">
                    <label
                      for="price"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Price</label
                    >
                    <input
                      type="number"
                      name="price"
                      id="price"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="$2999"
                      required=""
                    />
                  </div>
                  <div class="col-span-2 sm:col-span-1">
                    <label
                      for="category"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Category</label
                    >
                    <select
                      id="category"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option selected="">Select category</option>
                      <option value="TV">TV/Monitors</option>
                      <option value="PC">PC</option>
                      <option value="GA">Gaming/Console</option>
                      <option value="PH">Phones</option>
                    </select>
                  </div>
                  <div class="col-span-2">
                    <label
                      for="description"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Product Description</label
                    >
                    <textarea
                      id="description"
                      rows="4"
                      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write product description here"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    class="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Tambah Barang
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
