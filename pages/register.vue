<template>
  <div class="container mx-auto p-8 max-w-md">
    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold">Inscription</h1>
      </template>

      <form @submit.prevent="registerUser" class="space-y-4">
        <UFormGroup label="Nom" name="name">
          <UInput
            v-model="name"
            type="text"
            placeholder="Votre nom"
            required
          />
        </UFormGroup>

        <UFormGroup label="Email" name="email">
          <UInput
            v-model="email"
            type="email"
            placeholder="votre@email.com"
            required
          />
        </UFormGroup>

        <UFormGroup label="Mot de passe" name="password">
          <UInput
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </UFormGroup>

        <UFormGroup label="Confirmer le mot de passe" name="passwordConfirm">
          <UInput
            v-model="passwordConfirm"
            type="password"
            placeholder="••••••••"
            required
          />
        </UFormGroup>

        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <div v-if="success" class="text-green-600 text-sm">
          {{ success }}
        </div>

        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          :loading="loading"
        >
          S'inscrire
        </UButton>
      </form>

      <template #footer>
        <p class="text-sm text-gray-600 text-center">
          Vous avez déjà un compte ?
          <NuxtLink to="/login" class="text-primary-600 hover:underline">
            Se connecter
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/services/useAuth.js'

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

    // Validation des mots de passe
    if (password.value !== passwordConfirm.value) {
      error.value = 'Les mots de passe ne correspondent pas'
      return
    }

    const result = register(name.value, email.value, password.value)

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
    console.error('Erreur d\'inscription:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

</style>
