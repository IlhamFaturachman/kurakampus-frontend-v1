/** * Forgot Password Page */

<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="forgot-password-card shadow-10" style="width: 450px; max-width: 90vw">
      <!-- Header -->
      <q-card-section class="text-center q-pb-none q-pt-xl">
        <div class="row items-center justify-center q-mb-md">
          <q-avatar size="60px" color="primary" text-color="white">
            <q-icon name="lock_reset" size="32px" />
          </q-avatar>
        </div>
        <div class="text-h5 text-weight-bold text-grey-9">Forgot Password?</div>
        <div class="text-caption text-grey-7 q-mt-xs">
          Enter your email and we'll send you a reset link
        </div>
      </q-card-section>

      <!-- Success Message -->
      <q-card-section v-if="success" class="q-pt-md">
        <q-banner dense class="bg-positive text-white rounded-borders">
          <template #avatar>
            <q-icon name="check_circle" />
          </template>
          Password reset link has been sent to your email
        </q-banner>
      </q-card-section>

      <!-- Form -->
      <q-card-section class="q-pt-lg q-px-xl">
        <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
          <!-- Email Input -->
          <FormInput
            v-model="formData['email'] as string"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            :validators="[required('Email is required'), email()]"
            :validate-on-blur="true"
            @blur="setFieldTouched('email', true)"
          >
            <template #prepend>
              <q-icon name="email" color="grey-6" />
            </template>
          </FormInput>

          <!-- Submit Button -->
          <q-btn
            type="submit"
            color="primary"
            label="Send Reset Link"
            unelevated
            rounded
            size="lg"
            class="full-width q-mt-md text-weight-bold"
            :loading="isSubmitting"
            :disable="isSubmitting || !isValid"
          />

          <!-- Back to Sign In -->
          <div class="text-center q-mt-md">
            <q-btn flat no-caps label="Back to Sign In" color="primary" @click="goToSignin" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useForm } from '@/composables/useForm';
  import { AuthService } from '@/services/auth';
  import FormInput from '@/components/forms/FormInput.vue';
  import { required, email } from '@/utils/validators';
  import { ROUTE_NAMES } from '@/constants';

  /**
   * Router
   */
  const router = useRouter();

  /**
   * State
   */
  const success = ref<boolean>(false);

  /**
   * Form setup
   */
  const { formData, isValid, isSubmitting, setFieldTouched, submit } = useForm<
    Record<string, unknown>
  >(
    {
      email: '',
    } as Record<string, unknown>,
    {
      email: [required('Email is required'), email()],
    }
  );

  /**
   * Handle form submit
   */
  const handleSubmit = async (): Promise<void> => {
    await submit(async (data) => {
      await AuthService.requestPasswordReset(data as { email: string });
      success.value = true;

      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        goToSignin();
      }, 3000);
    });
  };

  /**
   * Navigate to sign in page
   */
  const goToSignin = (): void => {
    void router.push({ name: ROUTE_NAMES.LOGIN });
  };
</script>

<style scoped lang="scss">
  .forgot-password-card {
    border-radius: 16px;
  }
</style>
