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
        Retour aux acteurs
      </button>

      <!-- Chargement -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
        <p class="mt-4 text-xl text-gray-300">Chargement de l'acteur...</p>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="bg-red-900/50 border border-red-700 text-red-200 px-6 py-4 rounded-lg shadow-xl">
        <p class="font-bold text-lg">Erreur</p>
        <p>{{ error }}</p>
      </div>

      <!-- Details de l'acteur -->
      <div v-else-if="actor" class="space-y-8">
        <!-- Hero Section -->
        <div class="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-red-900/30">
          <div class="relative md:flex gap-8 p-8">
            <!-- Photo de l'acteur -->
            <div class="md:flex-shrink-0 md:w-1/3 mb-6 md:mb-0">
              <img
                  :src="`https://picsum.photos/seed/actor${actor.id}/400/600`"
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
                    Acteur
                  </span>
                </div>
                <h1 class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 mb-4">
                  {{ fullName }}
                </h1>

                <!-- Tags -->
                <div class="flex flex-wrap gap-3 mb-6">
                  <span v-if="actor.nationality" class="px-4 py-2 bg-red-600/20 text-red-400 rounded-full text-sm font-semibold border border-red-600/30">
                    {{ actor.nationality }}
                  </span>
                  <span v-if="actor.birthDate" class="px-4 py-2 bg-red-600/20 text-red-400 rounded-full text-sm font-semibold border border-red-600/30">
                    Ne(e) le {{ formatDate(actor.birthDate) }}
                  </span>
                  <span v-if="actor.deathDate" class="px-4 py-2 bg-gray-600/20 text-gray-400 rounded-full text-sm font-semibold border border-gray-600/30">
                    Decede(e) le {{ formatDate(actor.deathDate) }}
                  </span>
                </div>
              </div>

              <!-- Biographie -->
              <div class="bg-black/40 p-6 rounded-xl border border-red-900/30">
                <h2 class="text-2xl font-bold text-red-400 mb-4">Biographie</h2>
                <p class="text-gray-300 leading-relaxed text-lg">{{ actor.biography || 'Aucune biographie disponible' }}</p>
              </div>

              <!-- Infos complementaires -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gradient-to-br from-red-900/30 to-red-800/20 p-5 rounded-xl border border-red-700/40">
                  <p class="text-sm text-red-300 mb-1">Nationalite</p>
                  <p class="text-lg font-bold text-white">{{ actor.nationality || 'Non renseignee' }}</p>
                </div>

                <div class="bg-gradient-to-br from-red-900/30 to-red-800/20 p-5 rounded-xl border border-red-700/40">
                  <p class="text-sm text-red-300 mb-1">Date de naissance</p>
                  <p class="text-lg font-bold text-white">{{ formatDate(actor.birthDate) }}</p>
                </div>
              </div>

              <!-- Recompenses -->
              <div v-if="actor.rewards" class="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 p-5 rounded-xl border border-yellow-700/40">
                <p class="text-sm text-yellow-300 mb-1">Recompenses</p>
                <p class="text-lg font-bold text-white">{{ actor.rewards }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Réalisateurs -->
        <div v-if="directors.length > 0" class="bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-red-900/30 p-8">
          <h2 class="text-3xl font-bold text-red-400 mb-6">Réalisateurs</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <NuxtLink
              v-for="director in directors"
              :key="director.id"
              :to="`/director/${director.id}`"
              class="group"
            >
              <div class="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-600 transition-all">
                <img
                  :src="`https://picsum.photos/seed/director${director.id}/200/300`"
                  :alt="`${director.firstName} ${director.lastName}`"
                  class="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <div class="p-3">
                  <p class="text-white font-semibold truncate">{{ director.firstName }} {{ director.lastName }}</p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Filmographie -->
        <div v-if="actor.films && actor.films.length > 0" class="bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-red-900/30 p-8">
          <h2 class="text-3xl font-bold text-red-400 mb-6">Filmographie</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <NuxtLink
              v-for="film in actor.films"
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
          <p class="text-gray-400">Aucun film repertorie pour cet acteur</p>
        </div>
      </div>

      <!-- Acteur non trouve -->
      <div v-else class="text-center py-20 bg-gray-900/50 rounded-2xl border border-red-900/30">
        <p class="text-3xl text-gray-300 font-bold">Acteur non trouve</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ActorService from '@/services/actorService.js'

const route = useRoute()
const router = useRouter()

const actor = ref(null)
const loading = ref(true)
const error = ref(null)
const actorId = route.params.slug

const fullName = computed(() => {
  if (!actor.value) return ''
  const firstName = actor.value.firstName || actor.value.firstname || ''
  const lastName = actor.value.lastName || actor.value.lastname || ''
  return `${firstName} ${lastName}`.trim() || 'Nom inconnu'
})

const directors = computed(() => {
  if (!actor.value?.films) return []
  const directorsMap = new Map()

  actor.value.films.forEach(film => {
    if (film.director) {
      const dir = film.director
      const id = dir.id || (dir['@id'] ? dir['@id'].split('/').pop() : null)
      if (id && !directorsMap.has(id)) {
        directorsMap.set(id, {
          id,
          firstName: dir.firstName || dir.firstname || '',
          lastName: dir.lastName || dir.lastname || ''
        })
      }
    }
  })

  return Array.from(directorsMap.values())
})

const goBack = () => {
  router.push('/actors')
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

const fetchActorDetails = async () => {
  try {
    loading.value = true
    error.value = null

    const result = await ActorService.getActorById(actorId)
    actor.value = result
  } catch (err) {
    // console.error('Erreur chargement acteur:', err)
    error.value = `Impossible de charger l'acteur: ${err.message}`
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchActorDetails()
})
</script>
