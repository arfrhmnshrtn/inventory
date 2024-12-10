<script setup>
import { onMounted, ref, computed } from "vue";
import { initFlowbite } from "flowbite";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Data untuk item
const db = ref([]);
const alertSuccess = ref(false);
const message = ref("");

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
const isEdit = ref(false); // Status untuk membedakan tambah atau edit

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

// edit item
function editItem(item) {
  data.value = { ...item };
  isEdit.value = true; // Menandakan bahwa kita sedang dalam mode edit
  showModal.value = true;
}

// update barang
async function updateBarang() {
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
    const response = await fetch(
      `http://localhost:3000/api/inventory/${data.value.kode_barang}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data.value),
      }
    );

    const result = await response.json();

    if (result.message === "Barang berhasil diperbarui") {
      alertSuccess.value = true;
      setTimeout(() => {
        alertSuccess.value = false;
      }, 5000);
      // Reset form setelah update barang
      data.value = { kode_barang: "", nama_barang: "", stok: "", harga: "" };
      showModal.value = false; // Menutup modal setelah update barang
      isEdit.value = false;
      fetchData(); // Ambil data terbaru
    } else {
      alert("Gagal memperbarui barang");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Terjadi kesalahan saat memperbarui barang");
  }
}

// Hapus barang
async function deleteBarang(kode_barang) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/inventory/${kode_barang}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (result.message === "Barang berhasil dihapus") {
      alertSuccess.value = true;
      setTimeout(() => {
        alertSuccess.value = false;
      }, 5000);
      fetchData(); // Ambil data terbaru
    } else {
      alert("Gagal menghapus barang");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Terjadi kesalahan saat menghapus barang");
  }
}

// Fungsi untuk menyimpan barang (tambah/edit)
function saveBarang() {
  if (isEdit.value) {
    updateBarang(); // Memanggil fungsi update barang jika dalam mode edit
  } else {
    tambahBarang(); // Memanggil fungsi tambah barang jika dalam mode tambah
  }
}

// cetak pdf
// Cetak PDF
function printPDF() {
  const doc = new jsPDF();

  // Menambahkan judul
  doc.setFontSize(18);
  doc.text("Laporan Data Barang Masuk", 14, 20);

  // Menambahkan tabel
  const tableData = filterData.value.map((item) => [
    item.kode_barang,
    item.nama_barang,
    item.stok,
    item.harga,
  ]);

  doc.autoTable({
    head: [["Kode Barang", "Nama Barang", "Stok", "Harga"]],
    body: tableData,
    startY: 30, // Mulai dari posisi vertikal 30
  });

  // Menampilkan PDF di browser
  doc.output("dataurlnewwindow");
}
</script>

<template>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl mb-3 font-bold italic">Data Barang Masuk:</h1>

    <div class="flex justify-between items-center">
      <div>
        <button
          @click="showModal = true"
          class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          type="button"
        >
          + Tambah Barang Masuk
        </button>
        <button
          class="bg-green-500 hover:bg-green-600 ml-3 text-white py-2 px-4 rounded"
          @click="printPDF"
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

    <!-- Success Alert -->
    <div
      v-if="alertSuccess"
      class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
      role="alert"
    >
      <span class="font-medium italic">{{ message }}</span>
    </div>

    <!-- Table -->
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
            <th class="py-3 px-4 border-b border-gray-300">Jumlah</th>
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
            <td class="py-2 px-4 border-b border-gray-200 text-center">
              <button
                class="px-2 py-1 mr-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"
                @click="editItem(item)"
              >
                Edit
              </button>
              <button
                class="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                @click="deleteBarang(item.kode_barang)"
              >
                Hapus
              </button>
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

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-4 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">
            {{ isEdit ? "Edit Barang" : "Tambah Barang" }}
          </h3>
          <button
            @click="showModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
        <form @submit.prevent="saveBarang">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"
              >Kode Barang</label
            >
            <input
              v-model="data.kode_barang"
              type="text"
              class="w-full border px-4 py-2 rounded"
              placeholder="Masukkan Kode Barang"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"
              >Nama Barang</label
            >
            <input
              v-model="data.nama_barang"
              type="text"
              class="w-full border px-4 py-2 rounded"
              placeholder="Masukkan Nama Barang"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Stok</label>
            <input
              v-model="data.stok"
              type="number"
              class="w-full border px-4 py-2 rounded"
              placeholder="Masukkan Stok"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Harga</label>
            <input
              v-model="data.harga"
              type="number"
              class="w-full border px-4 py-2 rounded"
              placeholder="Masukkan Harga"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded"
          >
            {{ isEdit ? "Update" : "Simpan" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
