<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
    <div class="container mx-auto max-w-4xl">
      <!-- Bouton retour -->
      <button
          @click="goBack"
          class="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        ← Retour à la recherche
      </button>

      <!-- Chargement -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-xl text-white">Chargement...</p>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p class="font-bold">Erreur</p>
        <p>{{ error }}</p>
      </div>

      <!-- Détails du film -->
      <div v-else-if="film" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="md:flex">
          <!-- Image du film -->
          <div class="md:flex-shrink-0 md:w-1/3">
            <img
                :src="`https://picsum.photos/seed/${film.id}/400/600`"
                :alt="film.name"
                class="w-full h-full object-cover"
            />
          </div>

          <!-- Informations détaillées -->
          <div class="p-8 md:w-2/3">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ film.name }}</h1>

            <div class="space-y-4">
              <!-- Description -->
              <div>
                <h2 class="text-lg font-semibold text-gray-700 mb-2">📖 Synopsis</h2>
                <p class="text-gray-600 leading-relaxed">{{ film.description }}</p>
              </div>

              <!-- Informations principales -->
              <div class="grid grid-cols-2 gap-4 mt-6">
                <div class="bg-gray-50 p-4 rounded">
                  <p class="text-sm text-gray-500">Durée</p>
                  <p class="text-lg font-semibold text-gray-900">
                    {{ Math.floor(film.duration / 60) }} min
                  </p>
                </div>

                <div class="bg-gray-50 p-4 rounded">
                  <p class="text-sm text-gray-500">Date de sortie</p>
                  <p class="text-lg font-semibold text-gray-900">
                    {{ formatDate(film.releaseDate) }}
                  </p>
                </div>

                <div class="bg-gray-50 p-4 rounded">
                  <p class="text-sm text-gray-500">Note</p>
                  <p class="text-lg font-semibold text-gray-900">
                    ⭐ {{ film.nbStarlet }} / 5
                  </p>
                </div>

                <div class="bg-gray-50 p-4 rounded">
                  <p class="text-sm text-gray-500">ID</p>
                  <p class="text-lg font-semibold text-gray-900">#{{ film.id }}</p>
                </div>
              </div>

              <!-- Site officiel -->
              <div v-if="film.url" class="mt-6">
                <a
                    :href="film.url"
                    target="_blank"
                    class="inline-block px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  🔗 Visiter le site officiel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Film non trouvé -->
      <div v-else class="text-center py-12">
        <p class="text-xl text-white">Film non trouvé</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FilmService from '@/services/filmService.js'

const route = useRoute()
const router = useRouter()

const film = ref(null)
const loading = ref(true)
const error = ref(null)

// Récupérer l'ID depuis l'URL (slug)
const filmId = route.params.slug

const goBack = () => {
  router.push('/movies')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const fetchFilmDetails = async () => {
  try {
    loading.value = true
    error.value = null

    console.log('Chargement du film ID:', filmId)

    // Appel à ton API
    const result = await FilmService.getFilmById(filmId)
    console.log('Détails du film reçus:', result)

    film.value = result
  } catch (err) {
    console.error('Erreur lors du chargement du film:', err)
    error.value = `Impossible de charger le film #${filmId}`
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFilmDetails()
})
</script>