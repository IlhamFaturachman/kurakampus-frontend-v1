/** * Sign Up Page * Modern implementation with Composition API, TypeScript, and form validation */

<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="signup-card shadow-10" style="width: 500px; max-width: 90vw">
      <!-- Header -->
      <q-card-section class="text-center q-pb-none q-pt-xl">
        <div class="row items-center justify-center q-mb-md">
          <q-avatar size="60px" color="primary" text-color="white">
            <q-icon name="person_add" size="32px" />
          </q-avatar>
        </div>
        <div class="text-h5 text-weight-bold text-grey-9">Create Account</div>
        <div class="text-caption text-grey-7 q-mt-xs">Sign up to get started with KuraKampus</div>
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
          <!-- Name Fields -->
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <FormInput
                v-model="formData.firstName"
                label="First Name"
                placeholder="John"
                :validators="[required('First name is required')]"
                :validate-on-blur="true"
                @blur="() => setFieldTouched('firstName', true)"
              />
            </div>
            <div class="col-6">
              <FormInput
                v-model="formData.lastName"
                label="Last Name"
                placeholder="Doe"
                :validators="[required('Last name is required')]"
                :validate-on-blur="true"
                @blur="() => setFieldTouched('lastName', true)"
              />
            </div>
          </div>

          <!-- Username -->
          <FormInput
            v-model="formData.username"
            label="Username"
            placeholder="johndoe"
            :validators="[required('Username is required'), minLength(3), maxLength(30)]"
            :validate-on-blur="true"
            @blur="() => setFieldTouched('username', true)"
          >
            <template #prepend>
              <q-icon name="person" color="grey-6" />
            </template>
          </FormInput>

          <!-- Email -->
          <FormInput
            v-model="formData.email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            :validators="[required('Email is required'), email()]"
            :validate-on-blur="true"
            @blur="() => setFieldTouched('email', true)"
          >
            <template #prepend>
              <q-icon name="email" color="grey-6" />
            </template>
          </FormInput>

          <!-- Password -->
          <FormInput
            v-model="formData.password"
            label="Password"
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
            label="Confirm Password"
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

          <!-- Terms and Conditions -->
          <q-checkbox v-model="formData.agreeToTerms" dense color="primary" class="q-mt-sm">
            <template #default>
              <div class="text-caption text-grey-7">
                I agree to the
                <a href="#" class="text-primary text-weight-bold">Terms and Conditions</a>
              </div>
            </template>
          </q-checkbox>

          <!-- Submit Button -->
          <q-btn
            type="submit"
            color="primary"
            label="Create Account"
            unelevated
            rounded
            size="lg"
            class="full-width q-mt-md text-weight-bold"
            :loading="isSubmitting"
            :disable="isSubmitting || !isValid || !formData.agreeToTerms"
          />
        </q-form>
      </q-card-section>

      <!-- Divider -->
      <q-separator class="q-mt-lg q-mb-md" />

      <!-- Sign In Link -->
      <q-card-section class="text-center q-pt-none q-pb-xl">
        <div class="text-caption text-grey-7">
          Already have an account?
          <q-btn
            flat
            dense
            no-caps
            label="Sign in"
            color="primary"
            class="text-weight-bold"
            padding="none"
            @click="goToSignin"
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
  import {
    required,
    email,
    minLength,
    maxLength,
    password,
    confirmPassword,
  } from '@/utils/validators';
  import { ROUTE_NAMES } from '@/constants';
  import type { RegisterData } from '@/types/auth';

  /**
   * Router
   */
  const router = useRouter();

  /**
   * Authentication composable
   */
  const { register, error } = useAuth();

  /**
   * State
   */
  const showPassword = ref<boolean>(false);

  /**
   * Form setup
   */
  const { formData, isValid, isSubmitting, setFieldTouched, submit } = useForm<RegisterData>(
    {
      email: '',
      username: '',
      password: '',
      passwordConfirmation: '',
      firstName: '',
      lastName: '',
      agreeToTerms: false,
    },
    {
      firstName: [required('First name is required')],
      lastName: [required('Last name is required')],
      username: [required('Username is required'), minLength(3), maxLength(30)],
      email: [required('Email is required'), email()],
      password: [required('Password is required'), password()],
      passwordConfirmation: [
        required('Password confirmation is required'),
        confirmPassword('password'),
      ],
    }
  );

  /**
   * Handle form submit
   */
  const handleSubmit = async (): Promise<void> => {
    if (!formData.agreeToTerms) {
      return;
    }

    await submit(async (data) => {
      await register(data);
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
  .signup-card {
    border-radius: 16px;
  }
</style>
