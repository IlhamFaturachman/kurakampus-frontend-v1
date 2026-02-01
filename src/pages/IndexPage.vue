<script lang="ts">
  export default {
    data() {
      return {
        email: '',
        isScrolled: false,
      };
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      handleScroll() {
        this.isScrolled = window.scrollY > 20;
      },
    },
  };
</script>

<template>
  <!-- Navbar -->
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent',
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center h-16">
        <!-- Logo -->
        <div class="flex items-center flex-1">
          <span
            :class="[
              'text-2xl font-bold transition-colors duration-300',
              isScrolled ? 'text-blue-600' : 'text-white',
            ]"
          >
            kurakampus
          </span>
        </div>

        <!-- Center Navigation Links -->
        <div class="hidden md:flex items-center gap-8 flex-1 justify-center">
          <a
            href="#features"
            :class="[
              'font-medium hover:text-blue-600 transition-colors duration-300',
              isScrolled ? 'text-gray-700' : 'text-white',
            ]"
          >
            Fitur
          </a>
          <a
            href="#pricing"
            :class="[
              'font-medium hover:text-blue-600 transition-colors duration-300',
              isScrolled ? 'text-gray-700' : 'text-white',
            ]"
          >
            Harga
          </a>
          <a
            href="#testimoni"
            :class="[
              'font-medium hover:text-blue-600 transition-colors duration-300',
              isScrolled ? 'text-gray-700' : 'text-white',
            ]"
          >
            Testimoni
          </a>
        </div>

        <!-- Right Buttons -->
        <div class="hidden md:flex items-center gap-3 flex-1 justify-end">
          <q-btn
            flat
            label="Login"
            :text-color="isScrolled ? 'grey-7' : 'white'"
            class="transition-colors duration-300"
            :to="{ name: 'login' }"
          />
          <q-btn unelevated label="Gabung Waitlist" color="orange" class="px-6 py-2 rounded-lg" />
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <q-btn flat round :icon="'menu'" :color="isScrolled ? 'primary' : 'white'" />
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <div
    class="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600"
  >
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div>
          <div class="inline-block mb-4">
            <span class="text-white text-sm font-medium flex items-center">
              <q-icon name="circle" size="8px" class="mr-2" />
              Platform Organisasi Mahasiswa #1 di Indonesia
            </span>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
            Urus Organisasi Jadi
            <span class="text-orange-400">Lebih Mudah.</span>
          </h1>
          <p class="text-xl text-blue-50 mb-8">
            Fokus proker, biar AI yang urus admin. Platform manajemen terintegrasi pertama untuk
            BEM, Himpunan, dan UKM.
          </p>
          <div class="flex gap-4">
            <q-btn
              unelevated
              label="Gabung Waitlist Sekarang"
              class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-all duration-200"
            />
            <q-btn
              outline
              label="Lihat Demo"
              class="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-all duration-200"
            />
          </div>
          <p class="text-sm text-blue-100 mt-4">Dipercaya oleh 100+ Organisasi Kampus</p>
        </div>

        <!-- Right Content - Preview -->
        <div class="relative">
          <div class="bg-white rounded-2xl shadow-2xl p-6">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div class="bg-blue-600 text-white p-4 rounded-lg mb-4">
              Buatkan RAB untuk Seminar Nasional Gen-Z dong, budget 5jt.
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-start gap-3 mb-3">
                <q-icon name="description" class="text-gray-400" />
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm text-gray-600">Siap! Berikut draft RAB Estimasi:</span>
                  </div>
                  <div class="bg-white p-3 rounded border">
                    <div class="flex justify-between mb-2">
                      <span class="text-sm">Proposal Approved (30 pax)</span>
                      <span class="text-sm font-medium">Rp 1.500.000</span>
                    </div>
                    <div class="flex justify-between mb-2">
                      <span class="text-sm font-medium">Acc Dekanat</span>
                      <span class="text-sm font-medium">Rp 2.000.000</span>
                    </div>
                    <div class="flex justify-between mb-2">
                      <span class="text-sm">F&B & Sound</span>
                      <span class="text-sm">Rp 2.000.000</span>
                    </div>
                    <div class="border-t pt-2 mt-2">
                      <div class="flex justify-between">
                        <span class="text-sm font-bold text-blue-600">Total Estimasi</span>
                        <span class="text-sm font-bold text-blue-600">Rp 4.500.000</span>
                      </div>
                    </div>
                  </div>
                </div>
                <q-icon name="check_circle" class="text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Problem Section -->
  <div class="bg-white py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Kenapa Organisasi Sering <span class="text-red-500">Burnout?</span>
        </h2>
        <p class="text-xl text-gray-600">Masalah klasik yang bikin pengurus kabur satu per satu.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Problem Card 1 -->
        <div
          class="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-200"
        >
          <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
            <q-icon name="error_outline" size="32px" class="text-red-500" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Revisi Proposal Tanpa Henti?</h3>
          <p class="text-gray-600">
            Lelah bolak-balik rektorat cuma karena salah format margin? Template jadul bikin stress.
          </p>
        </div>

        <!-- Problem Card 2 -->
        <div
          class="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-200"
        >
          <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
            <q-icon name="folder_open" size="32px" class="text-orange-500" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Danus Seret?</h3>
          <p class="text-gray-600">
            Jualan risol gak nutup biaya panggung? Cari sponsor susah karena proposal kurang
            meyakinkan?
          </p>
        </div>

        <!-- Problem Card 3 -->
        <div
          class="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
        >
          <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <q-icon name="close" size="32px" class="text-blue-600" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Drama LPJ?</h3>
          <p class="text-gray-600">
            Nota hilang, deadline besok, dan format berantakan? Jangan biarkan demisioner hantu
            mimpimu.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Solution Section -->
  <div class="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-4">
        <span
          class="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6"
        >
          ⚡ Solusi Cerdas
        </span>
      </div>
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Satu Platform, Semua Urusan Beres.
        </h2>
        <p class="text-xl text-gray-600">
          Teknologi AI yang mengerti kebutuhan birokrasi kampusmu.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Feature Card 1 -->
        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
          <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <q-icon name="auto_awesome" size="32px" class="text-white" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">AI Proposal Generator</h3>
          <p class="text-gray-600 mb-6">
            Upload panduan kampusmu, dan biarkan AI menyusun proposal kegiatan lengkap dengan latar
            belakang yang valid dan tata bahasa baku. Tidak perlu copy-paste dari proposal tahun
            lalu.
          </p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div class="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div class="flex items-center gap-2 mb-2">
              <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div class="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <!-- Feature Card 2 -->
        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
          <div class="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6">
            <q-icon name="calculate" size="32px" class="text-white" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Smart Budgeting</h3>
          <p class="text-gray-600 mb-6">
            Rekomendasi strategi Danus dan estimasi RAB otomatis berdasarkan data pasar terkini.
          </p>
        </div>

        <!-- Feature Card 3 -->
        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
          <div class="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
            <q-icon name="receipt_long" size="32px" class="text-white" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Auto-LPJ Scanner</h3>
          <p class="text-gray-600 mb-6">
            Foto nota belanja, item langsung masuk laporan keuangan. Export PDF siap print.
          </p>
          <a href="#" class="text-blue-600 font-medium hover:underline flex items-center gap-2">
            Lihat cara kerja →
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- University Logos Section -->
  <div class="bg-white py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <p class="text-center text-gray-500 text-sm uppercase tracking-wider mb-8">
        DIDESAIN UNTUK KEBUTUHAN ORGANISASI KAMPUS DI INDONESIA
      </p>
      <div class="flex flex-wrap justify-center items-center gap-12 opacity-40">
        <span class="text-xl font-semibold text-gray-400">Universitas Indonesia</span>
        <span class="text-xl font-semibold text-gray-400">Institut Teknologi Bandung</span>
        <span class="text-xl font-semibold text-gray-400">Universitas Gadjah Mada</span>
        <span class="text-xl font-semibold text-gray-400">Institut Pertanian Bogor</span>
      </div>
    </div>
  </div>

  <!-- CTA Section -->
  <div class="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
        Selamatkan IPK dan Waktu Tidurmu.
      </h2>
      <p class="text-xl text-blue-100 mb-8">
        Bergabung dengan revolusi manajemen organisasi mahasiswa.<br />
        Fokus pada proker, biarkan AI yang mengurus administrasi.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
        <q-input
          v-model="email"
          outlined
          placeholder="Masukkan email kampus..."
          class="bg-white rounded-lg w-full sm:w-96"
          dense
        />
        <q-btn
          unelevated
          label="Gabung Waitlist"
          class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg whitespace-nowrap"
        />
      </div>
      <p class="text-sm text-blue-200">
        Dapatkan akses prioritas dan template proposal gratis saat rilis.
      </p>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div class="col-span-2">
          <h3 class="text-2xl font-bold text-white mb-4">kurakampus</h3>
          <p class="text-gray-400 mb-4">
            © 2024 kurakampus. Dibuat dengan ❤️ untuk Mahasiswa Indonesia.
          </p>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-4">Produk</h4>
          <ul class="space-y-2">
            <li><a href="#" class="hover:text-white transition-colors">Fitur</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Harga</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Testimoni</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-4">Legal</h4>
          <ul class="space-y-2">
            <li><a href="#" class="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Kebijakan Privasi</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
