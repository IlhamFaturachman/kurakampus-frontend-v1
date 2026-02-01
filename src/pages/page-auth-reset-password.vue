/** * Reset Password Page */

<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="reset-password-card shadow-10" style="width: 450px; max-width: 90vw">
      <!-- Header -->
      <q-card-section class="text-center q-pb-none q-pt-xl">
        <div class="row items-center justify-center q-mb-md">
          <q-avatar size="60px" color="primary" text-color="white">
            <q-icon name="lock_reset" size="32px" />
          </q-avatar>
        </div>
        <div class="text-h5 text-weight-bold text-grey-9">Reset Password</div>
        <div class="text-caption text-grey-7 q-mt-xs">Enter your new password</div>
      </q-card-section>

      <!-- Form -->
      <q-card-section class="q-pt-lg q-px-xl">
        <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
          <!-- Password -->
          <FormInput
            v-model="formData.password"
            label="New Password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="At least 8 characters"
            :validators="[required('Password is required'), password()]"
            :validate-on-blur="true"
            hint="Minimum 8 characters"
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

          <!-- Confirm Password -->
          <FormInput
            v-model="formData.passwordConfirmation"
            label="Confirm New Password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Re-enter your password"
            :validators="[
              required('Password confirmation is required'),
              confirmPassword('password', 'Passwords do not match'),
            ]"
            :validate-on-blur="true"
            @blur="() => setFieldTouched('passwordConfirmation', true)"
          >
            <template #prepend>
              <q-icon name="lock" color="grey-6" />
            </template>
          </FormInput>

          <!-- Submit Button -->
          <q-btn
            type="submit"
            color="primary"
            label="Reset Password"
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
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useForm } from '@/composables/useForm';
  import { useAppStore } from '@/stores/appStore';
  import { AuthService } from '@/services/auth';
  import FormInput from '@/components/forms/FormInput.vue';
  import { required, password, confirmPassword } from '@/utils/validators';
  import { ROUTE_NAMES } from '@/constants';
  import type { PasswordResetConfirmation } from '@/types/auth';

  /**
   * Router & Route
   */
  const router = useRouter();
  const route = useRoute();
  const appStore = useAppStore();

  /**
   * State
   */
  const showPassword = ref<boolean>(false);
  const resetToken = ref<string>('');

  /**
   * Form setup
   */
  const { formData, isValid, isSubmitting, setFieldTouched, submit } =
    useForm<PasswordResetConfirmation>(
      {
        token: '',
        password: '',
        passwordConfirmation: '',
      },
      {
        password: [required('Password is required'), password()],
        passwordConfirmation: [
          required('Password confirmation is required'),
          confirmPassword('password'),
        ],
      }
    );

  /**
   * Initialize
   */
  onMounted(() => {
    const token = route.query['token'] as string;
    if (!token) {
      appStore.showError('Invalid reset token');
      goToSignin();
      return;
    }

    resetToken.value = token;
    formData.token = token;
  });

  /**
   * Handle form submit
   */
  const handleSubmit = async (): Promise<void> => {
    await submit(async (data) => {
      await AuthService.confirmPasswordReset(data);
      appStore.showSuccess('Password reset successful. Please sign in with your new password.');

      // Redirect to sign in
      setTimeout(() => {
        goToSignin();
      }, 2000);
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
  .reset-password-card {
    border-radius: 16px;
  }
</style>
