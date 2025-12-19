<template>
  <div id="search-film" class="max-w-7xl mx-auto p-6">
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-white">Films</h1>
        <p v-if="session.isAuthenticated" class="text-white mt-1">
          Connecté en tant que <strong>{{ session.userName }}</strong>
          <span class="ml-2 px-2 py-1 rounded text-xs font-semibold"
                :class="{
                  'bg-red-100 text-red-800': session.isAdmin,
                  'bg-blue-100 text-blue-800': !session.isAdmin
                }">
            {{ session.userRole.toUpperCase() }}
          </span>
        </p>
      </div>
    </div>

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
              <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
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
          {{ numberResultat }} film(s) trouvé(s) sur {{ totalFilms }} au total
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

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="mt-4 text-gray-600">Chargement des films... {{ loadingProgress }}</p>
    </div>

    <!-- Grille des films -->
    <div v-else-if="filteredFilms.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div
          v-for="film in filteredFilms"
          :key="film.id || film['@id']"
          class="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
      >
        <div @click="goToFilm(getFilmId(film))">
          <img
              :src="getFilmImage(film)"
              :alt="film.name"
              class="w-full h-96 object-cover"
              loading="lazy"
              @error="handleImageError($event)"
          />

          <!-- Overlay avec titre au survol -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div class="p-4 w-full">
              <h3 class="text-white font-bold text-lg mb-2">{{ film.name }}</h3>
              <p class="text-gray-300 text-sm">
                {{ film.releaseDate ? new Date(film.releaseDate).getFullYear() : 'N/A' }} • {{ formatDuration(film.duration) }}
              </p>

              <!-- Afficher l'auteur si disponible -->
              <p v-if="film.authorName" class="text-gray-400 text-xs mt-2 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Par {{ film.authorName }}
              </p>
            </div>
          </div>
        </div>

        <!-- Boutons d'édition (uniquement si l'utilisateur peut éditer) -->
        <div v-if="canEditFilm(film)" class="absolute top-2 right-2 flex gap-2">
          <button
              @click.stop="editFilm(getFilmId(film))"
              class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg"
              title="Modifier"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
          <button
              v-if="session.isAdmin"
              @click.stop="deleteFilm(getFilmId(film))"
              class="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg"
              title="Supprimer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '~/stores/session'

definePageMeta({
  layout: 'default'
})

const API_URL = 'http://localhost:8319'

const router = useRouter()
const session = useSession()

const films = ref([])
const query = ref('')
const error = ref(null)
const loading = ref(false)
const loadingProgress = ref('')
const totalFilms = ref(0)

// Filtres
const filters = ref({
  director: '',
  year: '',
  sortBy: 'name'
})

// Extraire l'ID d'un film (peut être un nombre ou un IRI)
const getFilmId = (film) => {
  if (film.id) return film.id
  if (film['@id']) {
    // Extraire l'ID de l'IRI "/api/movies/123"
    return film['@id'].split('/').pop()
  }
  return null
}

// Obtenir l'image du film
const getFilmImage = (film) => {
  // Si le film a une image uploadée
  if (film.image?.contentUrl) {
    const url = film.image.contentUrl
    return url.startsWith('/') ? API_URL + url : url
  }
  if (film.imageUrl) {
    return film.imageUrl.startsWith('/') ? API_URL + film.imageUrl : film.imageUrl
  }
  if (film.url) {
    return film.url
  }
  // Sinon utiliser une image placeholder
  return `https://picsum.photos/seed/${getFilmId(film)}/300/450`
}

// Gérer les erreurs d'image
const handleImageError = (event) => {
  event.target.src = `https://picsum.photos/seed/${Math.random()}/300/450`
}

// Formater la durée
const formatDuration = (minutes) => {
  if (!minutes) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h${mins > 0 ? mins : ''}`
  }
  return `${mins} min`
}

// Fonction pour vérifier si l'utilisateur peut éditer un film (admin seulement)
const canEditFilm = () => {
  if (!session.isAuthenticated) return false
  return session.isAdmin
}

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
        film.director?.firstName?.toLowerCase().includes(directorTerm) ||
        film.director?.lastName?.toLowerCase().includes(directorTerm) ||
        film.director?.firstname?.toLowerCase().includes(directorTerm) ||
        film.director?.lastname?.toLowerCase().includes(directorTerm)
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

/**
 * Récupérer TOUS les films en une seule requête
 */
const getAllFilms = async () => {
  const token = session.token || localStorage.getItem('token')

  try {
    loading.value = true
    error.value = null

    // console.log('🎬 Récupération de tous les films...')

    const response = await fetch(`${API_URL}/api/movies?pagination=false`, {
      method: 'GET',
      headers: {
        'Accept': 'application/ld+json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    })

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`)
    }

    const data = await response.json()
    // console.log('📦 Réponse:', data)

    // Extraire les films
    const allFilms = data['hydra:member'] || data.member || []
    films.value = allFilms
    totalFilms.value = allFilms.length

    // console.log(`✅ Total films chargés: ${allFilms.length}`)

  } catch (err) {
    error.value = `Impossible de charger les films: ${err.message}`
    // console.error('❌ Erreur:', err)
  } finally {
    loading.value = false
    loadingProgress.value = ''
  }
}

// Rechercher un film
const searchFilm = () => {
  // console.log('Recherche:', query.value)
}

// Navigation vers la page de détail
const goToFilm = (filmId) => {
  router.push(`/movie/${filmId}`)
}

// Éditer un film
const editFilm = (filmId) => {
  router.push(`/films/edit/${filmId}`)
}

// Supprimer un film (admin uniquement)
const deleteFilm = async (filmId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) return

  const token = session.token || localStorage.getItem('token')

  try {
    const response = await fetch(`${API_URL}/api/movies/${filmId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/ld+json'
      }
    })

    if (response.ok || response.status === 204) {
      films.value = films.value.filter(f => getFilmId(f) !== filmId && getFilmId(f) !== String(filmId))
      totalFilms.value = films.value.length
      alert('✅ Film supprimé avec succès')
    } else {
      throw new Error(`Erreur ${response.status}`)
    }
  } catch (err) {
    // console.error('Erreur suppression:', err)
    alert('❌ Erreur lors de la suppression')
  }
}

// Effacer tous les filtres
const clearAllFilters = () => {
  query.value = ''
  filters.value.director = ''
  filters.value.year = ''
  filters.value.sortBy = 'name'
}

// Au montage du composant
onMounted(async () => {
  session.restoreSession()
  await getAllFilms()

  const searchInput = document.getElementById('search')
  if (searchInput) searchInput.focus()
})
</script>