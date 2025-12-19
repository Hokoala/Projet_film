<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white">Réalisateurs</h1>
      <p class="text-gray-400 mt-2">Découvrez les réalisateurs de notre catalogue</p>
    </div>

    <!-- Barre de recherche -->
    <div class="mb-8">
      <div class="relative max-w-md">
        <input
            v-model="searchQuery"
            type="text"
            class="w-full px-4 py-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Rechercher un réalisateur..."
        />
        <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <p class="mt-2 text-sm text-gray-500">{{ filteredDirectors.length }} réalisateur(s) trouvé(s)</p>
    </div>

    <!-- Erreur -->
    <div v-if="error" class="mb-6 p-4 bg-red-900/50 border border-red-600 text-red-300 rounded-lg">
      {{ error }}
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      <p class="mt-4 text-gray-400">Chargement des réalisateurs...</p>
    </div>

    <!-- Liste des réalisateurs -->
    <div v-else-if="filteredDirectors.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div
          v-for="director in filteredDirectors"
          :key="director.id"
          class="group bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 cursor-pointer"
          @click="goToDirector(director.id)"
      >
        <div class="aspect-square overflow-hidden">
          <img
              :src="`https://picsum.photos/seed/director-${director.id}/300/300`"
              :alt="`${director.firstName} ${director.lastName}`"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
          />
        </div>
        <div class="p-4">
          <h3 class="text-white font-semibold text-lg truncate">
            {{ director.firstName }} {{ director.lastName }}
          </h3>
          <p v-if="director.nationality" class="text-gray-400 text-sm mt-1">
            {{ director.nationality }}
          </p>
          <p v-if="director.movies?.length" class="text-red-400 text-sm mt-2">
            {{ director.movies.length }} film(s)
          </p>
        </div>
      </div>
    </div>

    <!-- Aucun résultat -->
    <div v-else class="text-center py-12">
      <p class="text-xl text-gray-400 mb-2">Aucun réalisateur trouvé</p>
      <p class="text-gray-500">
        {{ searchQuery ? 'Essayez avec d\'autres critères de recherche' : 'Aucun réalisateur disponible pour le moment' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DirectorService from '@/services/directorService.js'

definePageMeta({
  layout: 'default'
})

const router = useRouter()

const directors = ref([])
const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)

// Filtrer les réalisateurs par recherche
const filteredDirectors = computed(() => {
  if (!searchQuery.value.trim()) {
    return directors.value
  }

  const query = searchQuery.value.toLowerCase()
  return directors.value.filter(director =>
    director.firstName?.toLowerCase().includes(query) ||
    director.lastName?.toLowerCase().includes(query) ||
    director.nationality?.toLowerCase().includes(query)
  )
})

// Récupérer tous les réalisateurs
const getAllDirectors = async () => {
  try {
    loading.value = true
    error.value = null

    const result = await DirectorService.getAllDirectors()

    // Gérer différentes structures de réponse API
    if (Array.isArray(result)) {
      directors.value = result
    } else if (result['hydra:member']) {
      directors.value = result['hydra:member']
    } else if (result.member) {
      directors.value = result.member
    } else if (result.data) {
      directors.value = result.data
    } else {
      directors.value = []
    }
  } catch (err) {
    error.value = `Impossible de charger les réalisateurs: ${err.message}`
    // console.error('Erreur:', err)
  } finally {
    loading.value = false
  }
}

// Navigation vers la page de détail
const goToDirector = (directorId) => {
  router.push(`/director/${directorId}`)
}

onMounted(() => {
  getAllDirectors()
})
</script>
