<template>
  <div class="min-h-screen bg-gradient-to-b from-black to-gray-900">
    <div class="container mx-auto max-w-7xl px-4 py-8">
      <!-- Bouton retour -->
      <button
          @click="goBack"
          class="mb-6 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour aux realisateurs
      </button>

      <!-- Chargement -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
        <p class="mt-4 text-xl text-gray-300">Chargement du realisateur...</p>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="bg-red-900/50 border border-red-700 text-red-200 px-6 py-4 rounded-lg shadow-xl">
        <p class="font-bold text-lg">Erreur</p>
        <p>{{ error }}</p>
      </div>

      <!-- Details du realisateur -->
      <div v-else-if="director" class="space-y-8">
        <!-- Hero Section -->
        <div class="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-red-900/30">
          <div class="relative md:flex gap-8 p-8">
            <!-- Photo du realisateur -->
            <div class="md:flex-shrink-0 md:w-1/3 mb-6 md:mb-0">
              <img
                  :src="`https://picsum.photos/seed/director${director.id}/400/600`"
                  :alt="fullName"
                  class="w-full rounded-xl shadow-2xl border-4 border-red-600/50 object-cover"
                  style="height: 500px;"
              />
            </div>

            <!-- Informations detaillees -->
            <div class="md:w-2/3 space-y-6">
              <div>
                <div class="flex items-center gap-3 mb-4">
                  <span class="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-semibold">
                    Realisateur
                  </span>
                </div>
                <h1 class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 mb-4">
                  {{ fullName }}
                </h1>

                <!-- Tags -->
                <div class="flex flex-wrap gap-3 mb-6">
                  <span v-if="director.nationality" class="px-4 py-2 bg-red-600/20 text-red-400 rounded-full text-sm font-semibold border border-red-600/30">
                    {{ director.nationality }}
                  </span>
                  <span v-if="director.birthDate" class="px-4 py-2 bg-red-600/20 text-red-400 rounded-full text-sm font-semibold border border-red-600/30">
                    Ne(e) le {{ formatDate(director.birthDate) }}
                  </span>
                  <span v-if="director.deathDate" class="px-4 py-2 bg-gray-600/20 text-gray-400 rounded-full text-sm font-semibold border border-gray-600/30">
                    Decede(e) le {{ formatDate(director.deathDate) }}
                  </span>
                </div>
              </div>

              <!-- Biographie -->
              <div class="bg-black/40 p-6 rounded-xl border border-red-900/30">
                <h2 class="text-2xl font-bold text-red-400 mb-4">Biographie</h2>
                <p class="text-gray-300 leading-relaxed text-lg">{{ director.biography || 'Aucune biographie disponible' }}</p>
              </div>

              <!-- Infos complementaires -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gradient-to-br from-red-900/30 to-red-800/20 p-5 rounded-xl border border-red-700/40">
                  <p class="text-sm text-red-300 mb-1">Nationalite</p>
                  <p class="text-lg font-bold text-white">{{ director.nationality || 'Non renseignee' }}</p>
                </div>

                <div class="bg-gradient-to-br from-red-900/30 to-red-800/20 p-5 rounded-xl border border-red-700/40">
                  <p class="text-sm text-red-300 mb-1">Date de naissance</p>
                  <p class="text-lg font-bold text-white">{{ formatDate(director.birthDate) }}</p>
                </div>
              </div>

              <!-- Recompenses -->
              <div v-if="director.rewards" class="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 p-5 rounded-xl border border-yellow-700/40">
                <p class="text-sm text-yellow-300 mb-1">Recompenses</p>
                <p class="text-lg font-bold text-white">{{ director.rewards }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filmographie -->
        <div v-if="director.films && director.films.length > 0" class="bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-red-900/30 p-8">
          <h2 class="text-3xl font-bold text-red-400 mb-6">Filmographie</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <NuxtLink
              v-for="film in director.films"
              :key="film.id || film['@id']"
              :to="`/movie/${getFilmId(film)}`"
              class="group"
            >
              <div class="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-600 transition-all">
                <img
                  :src="`https://picsum.photos/seed/film${getFilmId(film)}/200/300`"
                  :alt="film.name || film.title || 'Film'"
                  class="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <div class="p-3">
                  <p class="text-white font-semibold truncate">{{ film.name || film.title || 'Film' }}</p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Message si pas de filmographie -->
        <div v-else class="text-center py-12 bg-gray-900/50 rounded-lg">
          <p class="text-gray-400">Aucun film repertorie pour ce realisateur</p>
        </div>
      </div>

      <!-- Realisateur non trouve -->
      <div v-else class="text-center py-20 bg-gray-900/50 rounded-2xl border border-red-900/30">
        <p class="text-3xl text-gray-300 font-bold">Realisateur non trouve</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DirectorService from '@/services/directorService.js'

const route = useRoute()
const router = useRouter()

const director = ref(null)
const loading = ref(true)
const error = ref(null)
const directorId = route.params.slug

const fullName = computed(() => {
  if (!director.value) return ''
  const firstName = director.value.firstName || director.value.firstname || ''
  const lastName = director.value.lastName || director.value.lastname || ''
  return `${firstName} ${lastName}`.trim() || 'Nom inconnu'
})

const goBack = () => {
  router.push('/directors')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getFilmId = (film) => {
  if (film.id) return film.id
  if (film['@id']) {
    const parts = film['@id'].split('/')
    return parts[parts.length - 1]
  }
  return ''
}

const fetchDirectorDetails = async () => {
  try {
    loading.value = true
    error.value = null

    const result = await DirectorService.getDirectorById(directorId)
    director.value = result
  } catch (err) {
    // console.error('Erreur chargement realisateur:', err)
    error.value = `Impossible de charger le realisateur: ${err.message}`
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchDirectorDetails()
})
</script>
