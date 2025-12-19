<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white">Acteurs</h1>
      <p class="text-gray-400 mt-2">Découvrez les acteurs de notre catalogue</p>
    </div>

    <!-- Barre de recherche -->
    <div class="mb-8">
      <div class="relative max-w-md">
        <input
            v-model="searchQuery"
            type="text"
            class="w-full px-4 py-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Rechercher un acteur..."
        />
        <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <p class="mt-2 text-sm text-gray-500">{{ filteredActors.length }} acteur(s) trouvé(s)</p>
    </div>

    <!-- Erreur -->
    <div v-if="error" class="mb-6 p-4 bg-red-900/50 border border-red-600 text-red-300 rounded-lg">
      {{ error }}
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      <p class="mt-4 text-gray-400">Chargement des acteurs...</p>
    </div>

    <!-- Liste des acteurs -->
    <div v-else-if="filteredActors.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div
          v-for="actor in filteredActors"
          :key="actor.id"
          class="group bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 cursor-pointer"
          @click="goToActor(actor.id)"
      >
        <div class="aspect-square overflow-hidden">
          <img
              :src="`https://picsum.photos/seed/actor-${actor.id}/300/300`"
              :alt="`${actor.firstName} ${actor.lastName}`"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
          />
        </div>
        <div class="p-4">
          <h3 class="text-white font-semibold text-lg truncate">
            {{ getActorName(actor) }}
          </h3>
          <p v-if="actor.nationality" class="text-gray-400 text-sm mt-1">
            {{ actor.nationality }}
          </p>
          <p v-if="actor.movies?.length || actor.films?.length" class="text-red-400 text-sm mt-2">
            {{ actor.movies?.length || actor.films?.length }} film(s)
          </p>
        </div>
      </div>
    </div>

    <!-- Aucun résultat -->
    <div v-else class="text-center py-12">
      <p class="text-xl text-gray-400 mb-2">Aucun acteur trouvé</p>
      <p class="text-gray-500">
        {{ searchQuery ? 'Essayez avec d\'autres critères de recherche' : 'Aucun acteur disponible pour le moment' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ActorService from '@/services/actorService.js'

definePageMeta({
  layout: 'default'
})

const router = useRouter()

const actors = ref([])
const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)

// Filtrer les acteurs par recherche
const filteredActors = computed(() => {
  if (!searchQuery.value.trim()) {
    return actors.value
  }

  const query = searchQuery.value.toLowerCase()
  return actors.value.filter(actor =>
    actor.firstName?.toLowerCase().includes(query) ||
    actor.lastName?.toLowerCase().includes(query) ||
    actor.nationality?.toLowerCase().includes(query)
  )
})

// Récupérer tous les acteurs
const getAllActors = async () => {
  try {
    loading.value = true
    error.value = null

    const result = await ActorService.getAllActors()

    // Gérer différentes structures de réponse API
    if (Array.isArray(result)) {
      actors.value = result
    } else if (result['hydra:member']) {
      actors.value = result['hydra:member']
    } else if (result.member) {
      actors.value = result.member
    } else if (result.data) {
      actors.value = result.data
    } else {
      actors.value = []
    }
  } catch (err) {
    error.value = `Impossible de charger les acteurs: ${err.message}`
    // console.error('Erreur:', err)
  } finally {
    loading.value = false
  }
}

// Récupérer le nom complet de l'acteur
const getActorName = (actor) => {
  const firstName = actor.firstName || actor.firstname || actor.prenom || ''
  const lastName = actor.lastName || actor.lastname || actor.nom || ''
  const fullName = `${firstName} ${lastName}`.trim()
  return fullName || actor.name || 'Nom inconnu'
}

// Navigation vers la page de détail
const goToActor = (actorId) => {
  router.push(`/actor/${actorId}`)
}

onMounted(() => {
  getAllActors()
})
</script>
