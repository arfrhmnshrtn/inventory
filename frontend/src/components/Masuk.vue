<script setup>
import { onMounted, ref, computed } from "vue";
import { initFlowbite } from "flowbite";

// Data untuk item
const db = ref([]);
const alertSuccess = ref(false);

const data = ref({
  kode_barang: "",
  nama_barang: "",
  stok: "",
  harga: "",
});

// Data pencarian
const searchQuery = ref("");
const filterData = ref([]);

// Modal visibility
const showModal = ref(false);

// Inisialisasi Flowbite dan ambil data saat komponen dimuat
onMounted(() => {
  initFlowbite();
  fetchData();
});

// Format angka ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};

// Ambil data dari API
async function fetchData() {
  try {
    const response = await fetch("http://localhost:3000/api/inventory");
    const data = await response.json();
    db.value = data;
    filterData.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Tambah barang baru
async function tambahBarang() {
  if (
    !data.value.kode_barang ||
    !data.value.nama_barang ||
    !data.value.stok ||
    !data.value.harga
  ) {
    alert("Semua field harus diisi!");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.value),
    });

    const result = await response.json();

    if (result.message === "Barang berhasil ditambahkan") {
      alertSuccess.value = true;
      setTimeout(() => {
        alertSuccess.value = false;
      }, 5000);
      // Reset form setelah menambah barang
      data.value = { kode_barang: "", nama_barang: "", stok: "", harga: "" };
      showModal.value = false; // Menutup modal setelah menambah barang
      fetchData(); // Ambil data terbaru
    } else {
      alert("Gagal menambahkan barang");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Terjadi kesalahan saat menambahkan barang");
  }
}

// Fungsi pencarian
function searchData(value) {
  searchQuery.value = value;

  if (searchQuery.value === "") {
    filterData.value = [...db.value];
    return;
  }

  filterData.value = db.value.filter((item) => {
    return item.nama_barang
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
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
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl sm:text-3xl font-bold italic mb-4">
      Data Barang Masuk:
    </h1>

    <!-- Actions -->
    <div class="flex flex-wrap justify-between items-center gap-3">
      <div class="flex flex-wrap gap-3">
        <button
          @click="showModal = true"
          class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          + Tambah Barang Masuk
        </button>
        <button
          class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Cetak Laporan
        </button>
      </div>
      <div class="w-full sm:w-auto">
        <input
          type="text"
          @input="searchData($event.target.value)"
          placeholder="Cari..."
          class="w-full sm:max-w-xs px-4 py-2 text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <!-- Success Alert -->
    <div
      v-if="alertSuccess"
      class="mt-4 p-4 text-sm text-green-800 rounded-lg bg-green-50"
      role="alert"
    >
      <span class="font-medium">Data berhasil ditambahkan :)</span>
    </div>

    <!-- Table -->
    <div class="mt-6 overflow-x-auto">
      <table
        class="w-full border-collapse border border-gray-300 shadow-lg rounded-md overflow-hidden"
      >
        <thead>
          <tr
            class="bg-purple-600 text-left text-sm font-semibold text-white uppercase"
          >
            <th class="py-3 px-4 border-b border-gray-300">No</th>
            <th class="py-3 px-4 border-b border-gray-300">Kode Barang</th>
            <th class="py-3 px-4 border-b border-gray-300">Nama Barang</th>
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
            <td class="py-2 px-4 border-b border-gray-200">{{ index + 1 }}</td>
            <td class="py-2 px-4 border-b border-gray-200">
              {{ item.kode_barang }}
            </td>
            <td class="py-2 px-4 border-b border-gray-200">
              {{ item.nama_barang }}
            </td>
            <td class="py-2 px-4 border-b border-gray-200">{{ item.stok }}</td>
            <td class="py-2 px-4 border-b border-gray-200">
              {{ rupiah(item.harga) }}
            </td>
            <td class="py-2 px-4 border-b border-gray-200 text-center">
              <button
                class="px-2 py-1 mr-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
              >
                Edit
              </button>
              <button
                class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex flex-wrap justify-between items-center mt-6 gap-3">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Previous
      </button>
      <div>
        <button
          v-for="page in totalPages"
          :key="page"
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
      </div>
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 px-4"
    >
      <div class="bg-white w-full max-w-sm p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Tambah Barang Masuk</h3>
        <form @submit.prevent="tambahBarang">
          <div class="mb-4">
            <label
              for="kode_barang"
              class="block text-sm font-medium text-gray-700"
              >Kode Barang</label
            >
            <input
              v-model="data.kode_barang"
              type="text"
              id="kode_barang"
              class="w-full border px-4 py-2 rounded"
              placeholder="Masukkan Kode Barang"
              required
            />
          </div>
          <div class="mb-4">
            <label
              for="nama_barang"
              class="block text-sm font-medium text-gray-700"
              >Nama Barang</label
            >
            <input
              v-model="data.nama_barang"
              type="text"
              id="nama_barang"
              class="w-full border px-4 py-2 rounded"
              placeholder="Masukkan Nama Barang"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded"
          >
            Tambah Barang
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
