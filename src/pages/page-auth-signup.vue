<template>
  <q-page class="flex flex-center">
    <q-card class="signup-card q-pa-md shadow-10" style="width: 500px; max-width: 90vw">
      <q-card-section class="text-center q-pb-none">
        <div class="row items-center justify-center q-mb-md">
          <q-avatar size="60px" color="secondary" text-color="white">
            <q-icon name="person_add" size="32px" />
          </q-avatar>
        </div>
        <div class="text-h5 text-weight-bold text-grey-9">Create Account</div>
        <div class="text-caption text-grey-7 q-mt-xs">Join KuraKampus today</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form @submit="handleSignup" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="formData.firstName"
                label="First Name"
                outlined
                color="secondary"
                :rules="[(val) => !!val || 'First name is required']"
              >
                <template #prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="formData.lastName"
                label="Last Name"
                outlined
                color="secondary"
                :rules="[(val) => !!val || 'Last name is required']"
              >
                <template #prepend>
                  <q-icon name="person_outline" />
                </template>
              </q-input>
            </div>
          </div>

          <q-input
            v-model="formData.email"
            label="Email Address"
            type="email"
            outlined
            color="secondary"
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
            v-model="formData.password"
            label="Password"
            :type="isPwd ? 'password' : 'text'"
            outlined
            color="secondary"
            hint="Min 6 characters"
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

          <q-input
            v-model="formData.confirmPassword"
            label="Confirm Password"
            :type="isConfirmPwd ? 'password' : 'text'"
            outlined
            color="secondary"
            :rules="[
              (val) => !!val || 'Please confirm your password',
              (val) => val === formData.password || 'Passwords do not match',
            ]"
          >
            <template #prepend>
              <q-icon name="lock_outline" />
            </template>
            <template #append>
              <q-icon
                :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isConfirmPwd = !isConfirmPwd"
              />
            </template>
          </q-input>

          <q-checkbox
            v-model="agreedToTerms"
            dense
            class="q-mt-sm"
            :rules="[(val: boolean) => !!val || 'You must agree to the terms']"
          >
            <template #default>
              <span class="text-caption text-grey-7">
                I agree to the
                <a href="#" class="text-secondary text-weight-bold" @click.prevent>
                  Terms of Service
                </a>
                and
                <a href="#" class="text-secondary text-weight-bold" @click.prevent>
                  Privacy Policy
                </a>
              </span>
            </template>
          </q-checkbox>

          <q-btn
            type="submit"
            color="secondary"
            label="Create Account"
            unelevated
            rounded
            size="lg"
            class="full-width q-mt-md text-weight-bold"
            :loading="loading"
            :disable="loading || !agreedToTerms"
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
          Already have an account?
          <q-btn
            flat
            dense
            no-caps
            label="Sign in"
            color="secondary"
            class="text-weight-bold"
            padding="none"
            @click="goToLogin"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Notify } from 'quasar';
  import { useAuthStore } from '@/stores/auth';
  import { ROUTE_NAMES } from '@/constants';

  const router = useRouter();
  const authStore = useAuthStore();

  const formData = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const loading = ref(false);
  const isPwd = ref(true);
  const isConfirmPwd = ref(true);
  const agreedToTerms = ref(false);

  const handleSignup = async (): Promise<void> => {
    loading.value = true;

    try {
      console.log('📝 Attempting registration...');

      // Auto-generate username from firstName_lastName (lowercase, only alphanumeric and underscore)
      const generatedUsername = `${formData.value.firstName}_${formData.value.lastName}`
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '');

      await authStore.register({
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        email: formData.value.email,
        username: generatedUsername,
        password: formData.value.password,
        passwordConfirmation: formData.value.confirmPassword,
        agreeToTerms: agreedToTerms.value,
      });

      console.log('✅ Registration successful!');

      Notify.create({
        type: 'positive',
        message: 'Account created successfully! Redirecting to dashboard...',
        position: 'top',
        timeout: 3000,
      });

      await router.push({ name: ROUTE_NAMES.DASHBOARD });
    } catch (err) {
      console.error('❌ Registration failed:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create account. Please try again.';
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

  const goToLogin = (): void => {
    void router.push({ name: ROUTE_NAMES.LOGIN });
  };
</script>

<style scoped lang="scss">
  .signup-card {
    border-radius: 16px;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.98);

    @media (max-width: 600px) {
      border-radius: 12px;
    }
  }
</style>
