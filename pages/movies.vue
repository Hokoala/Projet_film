<template>
  <div id="search-film" class="max-w-7xl mx-auto p-6">
    <!-- Barre de recherche et filtres -->
    <div class="mb-8">
      <form @submit.prevent="searchFilm" class="space-y-4">
        <!-- Champ de recherche principal -->
        <div class="flex gap-4 items-center">
          <div class="flex-1">
            <div class="relative">
              <input
                  id="search"
                  v-model="query"
                  type="text"
                  class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Rechercher par titre, réalisateur, acteur..."
              />
              <span class="absolute left-3 top-3.5 text-gray-400">🔍</span>
            </div>
          </div>
          <button
              v-if="query || filters.director || filters.year || filters.sortBy !== 'name'"
              @click="clearAllFilters"
              type="button"
              class="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Réinitialiser
          </button>
        </div>

        <!-- Filtres avancés -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Filtre par réalisateur -->
          <div>
            <label for="director" class="block text-sm font-medium text-gray-700 mb-1">
              Réalisateur
            </label>
            <input
                id="director"
                v-model="filters.director"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Nom du réalisateur"
            />
          </div>

          <!-- Filtre par année -->
          <div>
            <label for="year" class="block text-sm font-medium text-gray-700 mb-1">
              Année de sortie
            </label>
            <input
                id="year"
                v-model="filters.year"
                type="number"
                min="1900"
                max="2030"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ex: 2020"
            />
          </div>

          <!-- Tri -->
          <div>
            <label for="sortBy" class="block text-sm font-medium text-gray-700 mb-1">
              Trier par
            </label>
            <select
                id="sortBy"
                v-model="filters.sortBy"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="name">Titre (A-Z)</option>
              <option value="name-desc">Titre (Z-A)</option>
              <option value="date">Date (Plus récent)</option>
              <option value="date-desc">Date (Plus ancien)</option>
              <option value="duration">Durée (Plus long)</option>
              <option value="duration-desc">Durée (Plus court)</option>
            </select>
          </div>
        </div>
      </form>


      <div class="mt-4 flex flex-wrap gap-2 items-center">
        <span class="text-sm text-gray-600">
          {{ numberResultat }} film(s) trouvé(s)
        </span>


        <div class="flex flex-wrap gap-2">
          <span v-if="query" class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-1">
            Recherche: "{{ query }}"
            <button @click="query = ''" class="hover:text-indigo-900">✕</button>
          </span>
          <span v-if="filters.director" class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
            Réalisateur: "{{ filters.director }}"
            <button @click="filters.director = ''" class="hover:text-purple-900">✕</button>
          </span>
          <span v-if="filters.year" class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
            Année: {{ filters.year }}
            <button @click="filters.year = ''" class="hover:text-green-900">✕</button>
          </span>
        </div>
      </div>
    </div>


    <div v-if="error" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      {{ error }}
    </div>


    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="mt-4 text-gray-600">Chargement des films...</p>
    </div>


    <div v-else-if="filteredFilms.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div
          v-for="film in filteredFilms"
          :key="film.id"
          @click="goToFilm(film.id)"
          class="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
      >

        <img
            :src="`https://picsum.photos/seed/${film.id}/300/450`"
            :alt="film.name"
            class="w-full h-96 object-cover"
            loading="lazy"
        />

        <!-- Overlay avec titre au survol -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div class="p-4 w-full">
            <h3 class="text-white font-bold text-lg mb-2">{{ film.name }}</h3>
            <h3 class="text-white font-bold text-lg mb-2">{{ film.director }}</h3>
            <p class="text-gray-300 text-sm">
              {{ film.releaseDate ? new Date(film.releaseDate).getFullYear() : 'N/A' }} • {{ Math.floor(film.duration / 60) }} min
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Aucun résultat -->
    <div v-else-if="!loading && filteredFilms.length === 0" class="text-center py-12">
      <p class="text-xl text-gray-600 mb-2">Aucun film trouvé</p>
      <p class="text-gray-500">
        {{ query || filters.director || filters.year ? 'Essayez avec d\'autres critères de recherche' : 'Aucun film disponible pour le moment' }}
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

// Filtres
const filters = ref({
  director: '',
  year: '',
  sortBy: 'name'
})

// Nombre de résultats
const numberResultat = computed(() => filteredFilms.value.length)

// Films filtrés et triés
const filteredFilms = computed(() => {
  let result = [...films.value]

  // Filtre par recherche de titre
  if (query.value.trim()) {
    const searchTerm = query.value.toLowerCase()
    result = result.filter(film =>
      film.name?.toLowerCase().includes(searchTerm) ||
      film.description?.toLowerCase().includes(searchTerm)
    )
  }

  // Filtre par réalisateur
  if (filters.value.director.trim()) {
    const directorTerm = filters.value.director.toLowerCase()
    result = result.filter(film =>
      film.director?.toLowerCase().includes(directorTerm)
    )
  }

  // Filtre par année
  if (filters.value.year) {
    result = result.filter(film => {
      if (!film.releaseDate) return false
      const filmYear = new Date(film.releaseDate).getFullYear()
      return filmYear === parseInt(filters.value.year)
    })
  }

  // Tri
  switch (filters.value.sortBy) {
    case 'name':
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      break
    case 'name-desc':
      result.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
      break
    case 'date':
      result.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0))
      break
    case 'date-desc':
      result.sort((a, b) => new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0))
      break
    case 'duration':
      result.sort((a, b) => (b.duration || 0) - (a.duration || 0))
      break
    case 'duration-desc':
      result.sort((a, b) => (a.duration || 0) - (b.duration || 0))
      break
  }

  return result
})

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
  // La recherche se fait maintenant via le computed filteredFilms
  // Cette fonction est gardée pour la compatibilité du formulaire
}

// Effacer tous les filtres
const clearAllFilters = () => {
  query.value = ''
  filters.value.director = ''
  filters.value.year = ''
  filters.value.sortBy = 'name'
}

// Au montage du composant
onMounted(() => {
  getAllFilms()

  const searchInput = document.getElementById('search')
  if (searchInput) searchInput.focus()
})
</script>

<style scoped>

</style>