<script setup>
function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("hidden");
}
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar Kiri -->
    <aside class="w-64 bg-white shadow-md sidebar">
      <div class="p-4">
        <h1 class="text-3xl font-bold italic text-purple-600">SasFone</h1>
      </div>
      <nav class="mt-6">
        <ul class="space-y-4">
          <li class="w-full">
            <router-link
              to="/"
              active-class="bg-purple-600 text-white"
              class="w-full p-3 flex items-center"
            >
              <span class="me-2">
                <font-awesome-icon :icon="['fas', 'house']" />
              </span>
              <span class="material-icons">Dashboard</span>
            </router-link>
          </li>
          <li class="w-full">
            <router-link
              to="/databarang"
              active-class="bg-purple-600 text-white"
              class="w-full p-3 flex items-center"
            >
              <span class="me-2">
                <font-awesome-icon :icon="['fas', 'clipboard']" />
              </span>
              <span class="material-icons">Data Barang</span>
            </router-link>
          </li>
          <li class="w-full">
            <router-link
              to="/barangmasuk"
              active-class="bg-purple-600 text-white"
              class="w-full p-3 flex items-center"
            >
              <span class="me-2"
                ><font-awesome-icon :icon="['fas', 'inbox']"
              /></span>
              <span class="material-icons mr-3">Barang Masuk</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/barangkeluar"
              active-class="bg-purple-600 text-white"
              class="w-full p-3 flex items-center"
            >
              <span class="me-2"
                ><font-awesome-icon :icon="['fas', 'sign-out-alt']" />
              </span>
              <span class="material-icons mr-3">Barang Keluar</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar Atas -->
      <header class="flex items-center bg-white px-6 py-4 shadow-md">
        <div
          class="flex items-center space-x-4 cursor-pointer"
          @click="hideSidebar"
        >
          <font-awesome-icon :icon="['fas', 'bars']" />
        </div>

        <div class="ms-4">
          <p>{{ $route.name }}</p>
        </div>
      </header>

      <!-- Placeholder untuk konten -->
      <main class="flex-1 p-6">
        <!-- Added mt-6 to avoid overlap with header -->
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>
