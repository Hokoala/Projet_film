<template>
  <div id="search-film" class="max-w-7xl mx-auto">
    <!-- Barre de recherche -->
    <div class="mb-8">
      <form @submit.prevent="searchFilm" class="flex gap-4 items-center">
        <div class="flex-1">
          <div class="relative">
            <input
                id="search"
                v-model="query"
                type="text"
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Titre, réalisateur, acteur..."
            />
            <span class="absolute left-3 top-3.5 text-gray-400"></span>
          </div>
        </div>
        <button
            v-if="query"
            @click="clearSearch"
            type="button"
            class="mt-7 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
           Effacer
        </button>
      </form>
    </div>

    <!-- Erreur -->
    <div v-if="error" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      {{ error }}
    </div>


    </div>


  <div>
    <!-- Chargement -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="mt-4 text-gray-600">Chargement des films...</p>
    </div>

    <!-- Liste des films - Mode Liste -->
    <ul v-else-if="viewMode === 'list'" class="space-y-4">
      <li
          v-for="film in films"
          :key="film.id"
          @click="goToFilm(film.id)"
          class="p-4 rounded-lg bg-white border border-gray-200 flex gap-4 cursor-pointer hover:shadow-lg hover:border-indigo-300 transition-all"
      >
        <!-- Image du film -->
        <div class="flex-shrink-0">
          <img
              :src="`https://picsum.photos/seed/${film.id}/200/300`"
              :alt="film.name"
              class="w-32 h-48 object-cover rounded-lg shadow-md"
              loading="lazy"
          />
        </div>

        <!-- Informations du film -->
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ film.name }}</h3>

          <p class="text-sm text-gray-600 mb-3 line-clamp-3">
            {{ film.description || 'Pas de description disponible' }}
          </p>

          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-gray-500"> Durée:</span>
              <span class="font-medium text-gray-900">{{ Math.floor(film.duration / 60) }} min</span>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-gray-500"> Sortie:</span>
              <span class="font-medium text-gray-900">
                {{ film.releaseDate ? new Date(film.releaseDate).toLocaleDateString('fr-FR') : 'N/A' }}
              </span>
            </div>

            <div v-if="film.directors" class="flex items-center gap-2">
              <span class="text-gray-500"> Réalisateur:</span>
              <span class="font-medium text-gray-900 truncate">{{ film.directors }}</span>
            </div>
          </div>

        </div>

        <!-- Bouton voir plus -->
        <div class="flex items-center">
          <button class="px-4 py-2  transition">
            Voir
          </button>
        </div>
      </li>
    </ul>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
          v-for="film in films"
          :key="film.id"
          @click="goToFilm(film.id)"
          class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300"
      >

        <div class="relative">
          <img
              :src="`https://picsum.photos/seed/${film.id}/300/450`"
              :alt="film.name"
              class="w-full h-72 object-cover"
              loading="lazy"
          />
        </div>


        <div class="p-4">
          <h3 class="font-bold text-gray-900 mb-2 line-clamp-1">{{ film.name }}</h3>
          <p class="text-sm text-gray-600 mb-2 line-clamp-2">
            {{ film.description || 'Pas de description' }}
          </p>
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>️ {{ Math.floor(film.duration / 60) }} min</span>
            <span> {{ film.releaseDate ? new Date(film.releaseDate).getFullYear() : 'N/A' }}</span>
          </div>
        </div>
      </div>
    </div>


    <div v-if="!loading && films.length === 0" class="text-center py-12">
      <p class="text-xl text-gray-600 mb-2">Aucun film trouvé</p>
      <p class="text-gray-500">
        {{ query ? 'Essayez avec d\'autres mots-clés' : 'Aucun film disponible pour le moment' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FilmService from '@/services/filmService.js'

definePageMeta({
  layout: 'default'
})

const router = useRouter()

const films = ref([])
const query = ref('')
const error = ref(null)
const loading = ref(false)
const viewMode = ref('list')

const numberResultat = computed(() => films.value.length)

// Navigation vers la page de détail
const goToFilm = (filmId) => {
  router.push(`/movie/${filmId}`)
}

// Récupérer tous les films au chargement
const getAllFilms = async () => {
  try {
    loading.value = true
    error.value = null

    const result = await FilmService.getAllFilms()
    console.log('Tous les films:', result)

    films.value = result.member || result['hydra:member'] || []
  } catch (err) {
    console.error('Erreur lors de la récupération des films:', err)
    error.value = 'Impossible de charger les films'
  } finally {
    loading.value = false
  }
}

// Rechercher des films
const searchFilm = async () => {
  if (!query.value.trim()) {
    await getAllFilms()
    return
  }

  try {
    loading.value = true
    error.value = null

    const result = await FilmService.searchFilms(query.value)
    console.log('Résultat recherche:', result)

    films.value = result.member || result['hydra:member'] || []
  } catch (err) {
    films.value = []
    error.value = 'Erreur lors de la recherche'
    console.error('Erreur recherche:', err)
  } finally {
    loading.value = false
  }
}

// Effacer la recherche
const clearSearch = () => {
  query.value = ''
  getAllFilms()
}

// Watch sur la query pour recherche en temps réel
watch(query, (newQuery) => {
  if (newQuery.trim() === '') {
    getAllFilms()
  } else {
    searchFilm()
  }
})

// Au montage du composant
onMounted(() => {
  getAllFilms() // Charger tous les films au démarrage

  const searchInput = document.getElementById('search')
  if (searchInput) searchInput.focus()
})
</script>

<style scoped>

</style>