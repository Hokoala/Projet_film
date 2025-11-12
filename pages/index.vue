<template>
  <div class="container mx-auto p-8">
    <UCard>
      <template #header>
        <h1 class="text-4xl font-bold">Bienvenue sur le Projet Film</h1>
      </template>

      <p class="text-lg text-gray-600 mb-4">
        Ceci est la page d'accueil de votre application avec Nuxt UI.
      </p>

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
