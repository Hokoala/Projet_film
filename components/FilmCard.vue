<template>
  <article class="film-card border rounded p-4 hover:shadow-lg transition-shadow">
    <header class="space-y-2">
      <p>{{movie.name}}</p>
    </header>

    <div class="space-y-2 mt-3">
      <div class="space-y-1 text-sm">
        <p v-if="movie.released" class="text-gray-500">
          📅 <strong>Sortie:</strong> {{ movie.released }}
        </p>
        <p v-if="movie.director" class="text-gray-500">
          🎬 <strong>Réalisateur:</strong> {{ movie.director }}
        </p>
        <p v-if="movie.actors" class="text-gray-500">
          👥 <strong>Acteurs:</strong> {{ movie.actors }}
        </p>
      </div>

    </div>

    <footer class="mt-3">
      <div class="flex gap-2">
        <NuxtLink :to="`/films/${movie.id}`" class="no-underline">
          <button class="px-3 py-1 bg-blue-600 text-white rounded text-sm">Voir détails</button>
        </NuxtLink>
      </div>
    </footer>
  </article>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.film-card img { max-height: 16rem; object-fit: cover; }
</style>
