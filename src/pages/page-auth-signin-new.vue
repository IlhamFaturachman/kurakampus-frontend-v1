/** * Sign In Page * Refactored with Composition API, TypeScript, and form validation */

<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="login-card shadow-10" style="width: 450px; max-width: 90vw">
      <!-- Header -->
      <q-card-section class="text-center q-pb-none q-pt-xl">
        <div class="row items-center justify-center q-mb-md">
          <q-avatar size="60px" color="primary" text-color="white">
            <q-icon name="lock" size="32px" />
          </q-avatar>
        </div>
        <div class="text-h5 text-weight-bold text-grey-9">Welcome Back</div>
        <div class="text-caption text-grey-7 q-mt-xs">Sign in to continue to KuraKampus</div>
      </q-card-section>

      <!-- Error Alert -->
      <q-card-section v-if="error" class="q-pt-md">
        <q-banner dense class="bg-negative text-white rounded-borders">
          <template #avatar>
            <q-icon name="error" />
          </template>
          {{ error.message }}
        </q-banner>
      </q-card-section>

      <!-- Form -->
      <q-card-section class="q-pt-lg q-px-xl">
        <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
          <!-- Email Input -->
          <FormInput
            v-model="formData.email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            :validators="[required('Email is required'), email()]"
            :validate-on-blur="true"
            @blur="() => setFieldTouched('email', true)"
          >
            <template #prepend>
              <q-icon name="email" color="grey-6" />
            </template>
          </FormInput>

          <!-- Password Input -->
          <FormInput
            v-model="formData.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            :validators="[required('Password is required'), minLength(6)]"
            :validate-on-blur="true"
            @blur="() => setFieldTouched('password', true)"
          >
            <template #prepend>
              <q-icon name="lock" color="grey-6" />
            </template>
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                color="grey-6"
                @click="showPassword = !showPassword"
              />
            </template>
          </FormInput>

          <!-- Remember Me & Forgot Password -->
          <div class="row items-center justify-between q-mt-sm">
            <q-checkbox v-model="formData.rememberMe" label="Remember me" dense color="primary" />
            <q-btn
              flat
              dense
              no-caps
              label="Forgot password?"
              color="primary"
              class="text-caption"
              @click="goToForgotPassword"
            />
          </div>

          <!-- Submit Button -->
          <q-btn
            type="submit"
            color="primary"
            label="Sign In"
            unelevated
            rounded
            size="lg"
            class="full-width q-mt-md text-weight-bold"
            :loading="isSubmitting"
            :disable="isSubmitting || !isValid"
          />
        </q-form>
      </q-card-section>

      <!-- Divider -->
      <q-separator class="q-mt-lg q-mb-md" />

      <!-- Sign Up Link -->
      <q-card-section class="text-center q-pt-none q-pb-xl">
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
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuth } from '@/composables/useAuth';
  import { useForm } from '@/composables/useForm';
  import FormInput from '@/components/forms/FormInput.vue';
  import { required, email, minLength } from '@/utils/validators';
  import { ROUTE_NAMES } from '@/constants';
  import type { LoginCredentials } from '@/types/auth';

  /**
   * Router
   */
  const router = useRouter();

  /**
   * Authentication composable
   */
  const { login, error } = useAuth();

  /**
   * State
   */
  const showPassword = ref<boolean>(false);

  /**
   * Form setup
   */
  const { formData, isValid, isSubmitting, setFieldTouched, submit } = useForm<LoginCredentials>(
    {
      email: '',
      password: '',
      rememberMe: false,
    },
    {
      email: [required('Email is required'), email()],
      password: [required('Password is required'), minLength(6)],
    }
  );

  /**
   * Handle form submit
   */
  const handleSubmit = async (): Promise<void> => {
    await submit(async (data) => {
      await login(data);
    });
  };

  /**
   * Navigate to sign up page
   */
  const goToSignup = (): void => {
    void router.push({ name: ROUTE_NAMES.REGISTER });
  };

  /**
   * Navigate to forgot password page
   */
  const goToForgotPassword = (): void => {
    void router.push({ name: ROUTE_NAMES.FORGOT_PASSWORD });
  };
</script>

<style scoped lang="scss">
  .login-card {
    border-radius: 16px;
  }
</style>
