<script setup>
import { onMounted } from "vue";
import { initFlowbite } from "flowbite";
import jsPDF from "jspdf";
import "jspdf-autotable";

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite();
  fetchData();
  dataBarangMasuk();
});

import { ref, computed } from "vue";

// Data dummy
const db = ref([]);
const listBarang = ref([]);
const showModal = ref(false);
const isEdit = ref(false); // Status untuk membedakan tambah atau edit
const alertSuccess = ref(false);
const allertMessage = ref("");
const cekBanyakData = ref(0);

// Data pencarian
const searchQuery = ref("");
const filterData = ref([]);

const data = ref({
  kode_barang: "",
  nama_barang: "",
  jumlah: "",
  harga: "",
});

// Format angka ke Rupiah
const toRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};
async function fetchData() {
  try {
    const response = await fetch("http://localhost:3000/api/barangkeluar");
    const data = await response.json();
    db.value = data;
    cekBanyakData.value = data.length;
    filterData.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// tambah barang keluar
async function tambahBarang() {
  // Validasi input
  if (
    !data.value.kode_barang ||
    !data.value.nama_barang ||
    !data.value.jumlah ||
    !data.value.harga
  ) {
    alert("Semua field harus diisi!");
    return;
  }

  try {
    // If the item doesn't exist, add a new item
    const response = await fetch("http://localhost:3000/api/barangkeluar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.value),
    });

    const result = await response.json();

    if (result.message === "Barang berhasil ditambahkan") {
      showModal.value = false;
      alertSuccess.value = true;
      allertMessage.value = result.message;
      setTimeout(() => {
        alertSuccess.value = false;
      }, 5000);

      // Reset form setelah sukses
      data.value = {
        kode_barang: "",
        nama_barang: "",
        jumlah: "",
        harga: "",
      };

      // Refresh data dari server
      fetchData();
    }
  } catch (error) {
    console.error("Error saat menambah barang:", error);
    alert("Terjadi kesalahan saat mengirim data.");
  }
}

async function dataBarangMasuk() {
  try {
    const response = await fetch(`http://localhost:3000/api/databarangmasuk`);
    const data = await response.json();
    listBarang.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Memperbarui barangTerpilih ketika kode barang berubah
function pilihBarang(kodeBarang) {
  const barang = listBarang.value.find(
    (barang) => barang.kode_barang === kodeBarang
  );

  if (barang) {
    data.value.kode_barang = barang.kode_barang;
    data.value.nama_barang = barang.nama_barang;
    data.value.harga = barang.harga;
  }
}

// Update data barang keluar
// edit item
function editItem(item) {
  data.value = { ...item };
  isEdit.value = true; // Menandakan bahwa kita sedang dalam mode edit
  showModal.value = true;
  console.log(data.value);
}

function updateData() {
  if (
    !data.value.kode_barang ||
    !data.value.nama_barang ||
    !data.value.jumlah ||
    !data.value.harga
  ) {
    alert("Semua field harus diisi!");
    return;
  }

  fetch(
    `http://localhost:3000/api/edit/barangkeluar/${data.value.kode_barang}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.value),
    }
  )
    .then((response) => response.json())
    .then((result) => {
      isEdit.value = false;
      if (result.message === "Barang berhasil diperbarui") {
        alertSuccess.value = true;
        allertMessage.value = result.message;
        setTimeout(() => {
          alertSuccess.value = false;
        }, 5000);
        showModal.value = false;
        fetchData();
      } else {
        alert("Gagal memperbarui data!");
      }
    });
}

function saveData() {
  if (isEdit.value) {
    updateData();
  } else {
    tambahBarang();
  }
}

// hapus barang keluar
function deleteItem(kode_barang) {
  fetch(`http://localhost:3000/api/hapus/barangkeluar/${kode_barang}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.message === "Barang berhasil dihapus") {
        alertSuccess.value = true;
        allertMessage.value = result.message;
        setTimeout(() => {
          alertSuccess.value = false;
        }, 5000);
        fetchData();
      } else {
        alert("Gagal menghapus data!");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    });
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
// Cetak PDF
function printPDF() {
  const doc = new jsPDF();
  // Teks yang ingin ditampilkan
  const text = "Laporan Data Barang Masuk";

  // Lebar halaman
  const pageWidth = doc.internal.pageSize.width;

  // Hitung lebar teks
  const textWidth = doc.getTextWidth(text);

  // Hitung posisi X agar teks berada di tengah
  const xPos = (pageWidth - textWidth) / 2;

  // Tampilkan teks di tengah
  doc.text(text, xPos, 20);

  // Menambahkan judul
  doc.setFontSize(18);
  // doc.text("Laporan Data Barang Masuk", 10, 20);

  // Menambahkan tabel
  const tableData = filterData.value.map((item) => [
    item.kode_barang,
    item.nama_barang,
    item.jumlah,
    toRupiah(item.harga),
  ]);

  doc.autoTable({
    head: [["Kode Barang", "Nama Barang", "Jumlah", "Harga"]],
    body: tableData,
    startY: 30, // Mulai dari posisi vertikal 30
  });

  // Menampilkan PDF di browser
  doc.output("dataurlnewwindow");
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl mb-3 font-bold italic">Data Barang Keluar:</h1>
    <div class="flex justify-between items-center">
      <div>
        <button
          @click="showModal = true"
          class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          + Tambah Barang Keluar
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
      <span class="font-medium italic">{{ allertMessage }}</span>
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
              {{ item.jumlah }}
            </td>
            <td class="py-2 px-4 border-b border-gray-200 text-gray-700">
              {{ toRupiah(item.harga) }}
            </td>
            <td class="py-2 px-4 border-b border-gray-200 text-center">
              <button
                class="px-2 py-1 mr-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"
                @click="editItem(item)"
              >
                Edit
              </button>
              <button
                class="px-2 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                @click="deleteItem(item.kode_barang)"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4" v-if="cekBanyakData > 10">
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
    <div
      v-if="showModal"
      class="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50"
    >
      <div>
        <!-- Main modal -->
        <div class="rounded-lg p-4 w-full max-w-md">
          <div class="relative p-4 w-full max-w-md max-h-full">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <!-- Modal header -->
              <div
                class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
              >
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Tambah Barang Kelaur
                </h3>
                <button
                  type="button"
                  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  @click="showModal = false"
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
              <form class="p-4 md:p-5" @submit.prevent="saveData">
                <div class="grid gap-4 mb-4 grid-cols-2">
                  <div class="col-span-2">
                    <label
                      for="category"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Kode Barang</label
                    >
                    <select
                      id="category"
                      @change="pilihBarang($event.target.value)"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option
                        v-for="item in listBarang"
                        :key="item.id"
                        :selected="item.kode_barang === data.kode_barang"
                        :value="item.kode_barang"
                      >
                        {{ item.kode_barang }}
                      </option>
                    </select>
                  </div>
                  <div class="col-span-2 sm:col-span-1">
                    <label
                      for="price"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Nama Barang</label
                    >
                    <input
                      type="text"
                      name="price"
                      id="price"
                      v-model="data.nama_barang"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Nama Barang"
                      required=""
                      disabled
                    />
                  </div>
                  <div class="col-span-2 sm:col-span-1">
                    <label
                      for="price"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Jumlah</label
                    >
                    <input
                      type="number"
                      name="price"
                      v-model="data.jumlah"
                      id="price"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Jumlah"
                      required=""
                    />
                  </div>
                  <div class="col-span-2 sm:col-span-1">
                    <label
                      for="price"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Harga</label
                    >
                    <input
                      type="number"
                      name="price"
                      id="price"
                      v-model="data.harga"
                      disabled
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="$2999"
                      required=""
                    />
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
                  {{ isEdit ? "Edit Barang" : "Tambah Barang" }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
