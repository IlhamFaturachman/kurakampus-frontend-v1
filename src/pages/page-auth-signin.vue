<template>
  <q-page class="flex flex-center">
    <q-card class="login-card q-pa-md shadow-10" style="width: 450px; max-width: 90vw">
      <q-card-section class="text-center q-pb-none">
        <div class="row items-center justify-center q-mb-md">
          <q-avatar size="60px" color="primary" text-color="white">
            <q-icon name="lock" size="32px" />
          </q-avatar>
        </div>
        <div class="text-h5 text-weight-bold text-grey-9">Welcome Back</div>
        <div class="text-caption text-grey-7 q-mt-xs">Sign in to continue to KuraKampus</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form ref="loginForm" @submit.prevent="handleLogin" class="q-gutter-md">
          <q-input
            v-model="credentials.email"
            label="Email Address"
            type="email"
            outlined
            color="primary"
            :rules="[
              (val) => !!val || 'Email is required',
              (val) => /.+@.+\..+/.test(val) || 'Email must be valid',
            ]"
          >
            <template #prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="credentials.password"
            label="Password"
            :type="isPwd ? 'password' : 'text'"
            outlined
            color="primary"
            :rules="[
              (val) => !!val || 'Password is required',
              (val) => val.length >= 6 || 'Password must be at least 6 characters',
            ]"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <template #append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="row items-center justify-between q-mt-sm">
            <q-checkbox v-model="rememberMe" label="Remember me" dense />
            <q-btn
              flat
              dense
              no-caps
              label="Forgot password?"
              color="primary"
              class="text-caption"
            />
          </div>

          <q-btn
            type="submit"
            color="primary"
            label="Sign In"
            unelevated
            rounded
            size="lg"
            class="full-width q-mt-md text-weight-bold"
            :loading="loading"
            :disable="loading"
          >
            <template #loading>
              <q-spinner-dots color="white" />
            </template>
          </q-btn>
        </q-form>
      </q-card-section>

      <q-separator class="q-mt-lg q-mb-md" />

      <q-card-section class="text-center q-pt-none">
        <div class="text-caption text-grey-7">
          Don't have an account?
          <q-btn
            flat
            dense
            no-caps
            label="Sign up"
            color="primary"
            class="text-weight-bold"
            padding="none"
            @click="goToSignup"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { Notify, type QForm } from 'quasar';
  import { ROUTE_NAMES } from '@/constants';

  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const loginForm = ref<QForm | null>(null);

  // Get redirect URL from query params
  const redirectUrl = computed(() => {
    const redirect = route.query['redirect'] as string | undefined;
    return redirect ?? '/app';
  });

  const credentials = ref({
    email: '',
    password: '',
  });

  const loading = ref(false);
  const isPwd = ref(true);
  const rememberMe = ref(false);

  const handleLogin = async (): Promise<void> => {
    // Validate form first
    const isValid = await loginForm.value?.validate();
    if (!isValid) return;

    loading.value = true;

    try {
      console.log('🔐 Attempting login...');
      await authStore.login(credentials.value);
      console.log('✅ Login successful, redirecting to:', redirectUrl.value);

      Notify.create({
        type: 'positive',
        message: 'Login successful!',
        position: 'top',
        timeout: 2000,
      });

      // Redirect to the URL from query params or default to dashboard
      await router.push(redirectUrl.value);
    } catch (err) {
      console.error('❌ Login failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password';
      Notify.create({
        type: 'negative',
        message: errorMessage,
        position: 'top',
        timeout: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  const goToSignup = (): void => {
    void router.push({ name: ROUTE_NAMES.REGISTER });
  };
</script>
