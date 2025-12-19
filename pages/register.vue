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
          <h1 class="text-3xl font-bold text-white mb-2">Inscription</h1>
          <p class="text-red-400">Créez votre compte Utopia Cinema</p>
        </div>
      </template>

      <form @submit.prevent="registerUser" class="space-y-4 px-2">
        <div>
          <label class="block text-sm font-medium text-red-300 mb-2">Nom</label>
          <UInput
              v-model="name"
              type="text"
              placeholder="Votre nom"
              size="lg"
              required
              class="bg-gray-900 border-red-900 text-white"
          />
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
        </div>

        <div>
          <label class="block text-sm font-medium text-red-300 mb-2">Confirmer le mot de passe</label>
          <UInput
              v-model="passwordConfirm"
              type="password"
              placeholder="••••••••"
              size="lg"
              required
              class="bg-gray-900 border-red-900 text-white"
          />
        </div>

        <div v-if="error" class="text-red-400 text-sm bg-red-950/50 p-3 rounded border border-red-900">
          {{ error }}
        </div>

        <div v-if="success" class="text-green-400 text-sm bg-green-950/50 p-3 rounded border border-green-900">
          {{ success }}
        </div>

        <UButton
            type="submit"
            color="red"
            size="lg"
            block
            :loading="loading"
            class="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold"
        >
          S'inscrire
        </UButton>
      </form>

      <template #footer>
        <div class="text-center text-sm pt-2">
          <p class="text-gray-400 mb-2">Vous avez déjà un compte ?</p>
          <NuxtLink to="/login" class="text-red-500 hover:text-red-400 font-semibold hover:underline">
            Se connecter
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/services/useAuth.js'

definePageMeta({
  layout: 'auth'
});

const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const registerUser = async () => {
  try {
    loading.value = true
    error.value = null
    success.value = null

    if (password.value !== passwordConfirm.value) {
      error.value = 'Les mots de passe ne correspondent pas'
      return
    }

    const result = await register(name.value, email.value, password.value)

    if (result.success) {
      success.value = 'Inscription réussie ! Redirection...'

      setTimeout(async () => {
        await navigateTo('/films')
      }, 1500)
    } else {
      error.value = result.error
    }

  } catch (err) {
    error.value = err.message || 'Erreur lors de l\'inscription'
    // console.error('Erreur d\'inscription:', err)
  } finally {
    loading.value = false
  }
}
</script>
