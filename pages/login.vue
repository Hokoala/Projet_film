<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950 p-4 relative overflow-hidden">
    <!-- Effet de projecteur cinéma -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-red-700 rounded-full blur-3xl"></div>
    </div>

    <UCard class="w-full max-w-md shadow-2xl bg-black/80 backdrop-blur-md border border-red-900/50 relative z-10">
      <template #header>
        <div class="text-center py-2">
          <div class="flex justify-center mb-3">
            <div class="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">Connexion</h1>
          <p class="text-red-400">Bienvenue sur Utopia Cinema</p>
        </div>
      </template>

      <form @submit.prevent="handleLogin" class="space-y-6 px-2">
        <!-- Message d'erreur -->
        <div v-if="error" class="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
          {{ error }}
        </div>

        <!-- Message de succès -->
        <div v-if="success" class="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded">
          {{ success }}
        </div>

        <div>
          <label class="block text-sm font-medium text-red-300 mb-2">Email</label>
          <UInput
              v-model="email"
              type="email"
              placeholder="votre@email.com"
              size="lg"
              required
              class="bg-gray-900 border-red-900 text-white"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-red-300 mb-2">Mot de passe</label>
          <UInput
              v-model="password"
              type="password"
              placeholder="••••••••"
              size="lg"
              required
              class="bg-gray-900 border-red-900 text-white"
          />
          <div class="text-right mt-2">
            <button
                type="button"
                @click="showForgotPassword = true"
                class="text-sm text-red-400 hover:text-red-300 hover:underline"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>

        <UButton
            type="submit"
            color="red"
            size="lg"
            block
            :loading="loading"
            class="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold"
        >
          Se connecter
        </UButton>
      </form>

      <template #footer>
        <div class="text-center text-sm pt-2">
          <p class="text-gray-400 mb-2">Pas encore de compte ?</p>
          <NuxtLink to="/register" class="text-red-500 hover:text-red-400 font-semibold hover:underline">
            Créer un compte
          </NuxtLink>
        </div>
      </template>
    </UCard>

    <!-- Modal Mot de passe oublié -->
    <UModal v-model="showForgotPassword">
      <UCard class="bg-gray-900 border border-red-900/50">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white">Mot de passe oublié</h3>
            <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="showForgotPassword = false"
            />
          </div>
        </template>

        <form @submit.prevent="handleForgotPassword" class="space-y-4">
          <p class="text-gray-400 text-sm">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>

          <div v-if="forgotError" class="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded text-sm">
            {{ forgotError }}
          </div>

          <div v-if="forgotSuccess" class="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded text-sm">
            {{ forgotSuccess }}
          </div>

          <div>
            <label class="block text-sm font-medium text-red-300 mb-2">Email</label>
            <UInput
                v-model="forgotEmail"
                type="email"
                placeholder="votre@email.com"
                size="lg"
                required
                class="bg-gray-800 border-red-900 text-white"
            />
          </div>

          <div class="flex gap-3 justify-end">
            <UButton
                type="button"
                color="gray"
                variant="outline"
                @click="showForgotPassword = false"
            >
              Annuler
            </UButton>
            <UButton
                type="submit"
                color="red"
                :loading="forgotLoading"
                class="bg-gradient-to-r from-red-600 to-red-800"
            >
              Envoyer le lien
            </UButton>
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '~/services/useAuth.js'

definePageMeta({
  layout: 'auth'
});

const { login, forgotPassword } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)

// Mot de passe oublié
const showForgotPassword = ref(false)
const forgotEmail = ref('')
const forgotLoading = ref(false)
const forgotError = ref(null)
const forgotSuccess = ref(null)

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = null
    success.value = null

    const result = await login(email.value, password.value)

    if (result.success) {
      success.value = 'Connexion réussie ! Redirection...'

      setTimeout(async () => {
        await navigateTo('/')
      }, 1500)
    } else {
      error.value = result.error
    }

  } catch (err) {
    error.value = err.message || 'Erreur lors de la connexion'
    // console.error('Erreur de connexion:', err)
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async () => {
  try {
    forgotLoading.value = true
    forgotError.value = null
    forgotSuccess.value = null

    const result = await forgotPassword(forgotEmail.value)

    if (result.success) {
      forgotSuccess.value = result.message
      forgotEmail.value = ''
    } else {
      forgotError.value = result.error
    }
  } catch (err) {
    forgotError.value = err.message || 'Une erreur est survenue'
  } finally {
    forgotLoading.value = false
  }
}
</script>