<template>
  <div class="container mx-auto p-8 max-w-md">
    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold">Connexion</h1>
      </template>

      <form @submit.prevent="loginUser" class="space-y-4">
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

        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          :loading="loading"
        >
          Se connecter
        </UButton>
      </form>

      <template #footer>
        <p class="text-sm text-gray-600 text-center">
          Pas encore de compte ?
          <NuxtLink to="/register" class="text-primary-600 hover:underline">
            S'inscrire
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/services/useAuth.js'

const { login } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

const loginUser = async () => {
  try {
    loading.value = true
    error.value = null

    const result = await login(email.value, password.value)

    if (result.success) {
      // Rediriger vers la page des films
      await navigateTo('/')
    } else {
      error.value = result.error
    }

  } catch (err) {
    error.value = err.message || 'Erreur lors de la connexion'
    console.error('Erreur de connexion:', err)
  } finally {
    loading.value = false
  }
}


</script>

<style scoped>

</style>
