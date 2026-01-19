<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navbar Transparent dengan Tailwind -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo / Brand -->
          <div class="flex items-center space-x-3">
            <q-btn flat round dense icon="menu" class="lg:hidden" />
            <span
              class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              KuraKampus
            </span>
          </div>

          <!-- Navigation Links - Desktop -->
          <div class="hidden lg:flex items-center space-x-8">
            <a
              href="#"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Pricing
            </a>
            <a
              href="#"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              About
            </a>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-4">
            <q-btn
              flat
              label="Login"
              class="hidden sm:inline-flex text-gray-700 hover:text-blue-600"
              to="/auth/login"
            />
            <q-btn
              unelevated
              label="Sign Up"
              class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-shadow duration-200"
              to="/auth/signup"
            />
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to
          <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >KuraKampus</span
          >
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your ultimate platform for campus management and collaboration
        </p>
        <div class="flex justify-center space-x-4">
          <q-btn
            unelevated
            label="Get Started"
            size="lg"
            class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:shadow-xl transition-all duration-200"
            to="/auth/signup"
          />
          <q-btn
            outline
            label="Learn More"
            size="lg"
            class="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
          />
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <q-icon name="school" size="24px" class="text-blue-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Easy Learning</h3>
          <p class="text-gray-600">Access all your courses and materials in one place</p>
        </div>

        <div
          class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <q-icon name="people" size="24px" class="text-indigo-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Collaboration</h3>
          <p class="text-gray-600">Connect and collaborate with classmates</p>
        </div>

        <div
          class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <q-icon name="analytics" size="24px" class="text-purple-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Track Progress</h3>
          <p class="text-gray-600">Monitor your academic progress in real-time</p>
        </div>
      </div>
    </div>
  </div>
</template>
