<template>
  <div class="container mx-auto p-8">
    <UCard>
      <template #header>
        <h1 class="text-4xl font-bold">Bienvenue sur le Projet Film</h1>
      </template>

      <p class="text-lg text-gray-600 mb-4">
        Ceci est la page d'accueil de votre application avec Nuxt UI.
      </p>

      <div class="flex gap-4">
        <NuxtLink to="/register">
          <UButton color="primary" size="lg">
            S'inscrire
          </UButton>
        </NuxtLink>

        <NuxtLink to="/login">
          <UButton color="gray" size="lg" variant="soft">
            Se connecter
          </UButton>
        </NuxtLink>

        <NuxtLink to="/movies">
          <UButton color="gray" size="lg" variant="ghost">
            Découvrir les films
          </UButton>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>

<script setup>

// this is my API_URL : API_URL=http://localhost:8319/api
// Get API_URL with using runtime config
const config = useRuntimeConfig();
const api = String(config.public.apiUrl);

console.log("API:" + api);

</script>

<style scoped>

</style>
