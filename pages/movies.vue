<template>
  <div id="search-film">
    <button @click="handleLogout" style="float:right">Déconnexion</button>
    <form @submit.prevent="searchFilm">
      <label for="search">Rechercher :</label>
      <input id="search" v-model="query" type="text">
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p class="text-black">{{ numberResultat }} film(s) trouvé(s)</p>

    <ul class="films space-y-4">
      <li
          v-for="film in films"
          :key="film.id"
          class="p-4 rounded bg-emerald-50 text-black border border-gray-300"
      >
        <h3 class="text-lg font-semibold text-black">{{ film.name }}</h3>


        <p class="text-sm text-black mb-2">{{ film.description }}</p>

        <p class="text-xs text-gray-600 mb-1">
          <strong>Durée:</strong> {{ film.duration }} min
        </p>

        <p class="text-xs text-gray-600 mb-1">
          <strong>Date de sortie:</strong> {{ film.releaseDate }}
        </p>

        <p class="text-xs text-gray-600 mb-1">
          <strong>Note:</strong> {{ film.nbStarlet }}/5
        </p>

        <p class="text-xs text-gray-600 mb-1" v-if="film.directors">
          <strong>Réalisateur:</strong> {{ film.directors }}
        </p>

        <p class="text-xs text-blue-600" v-if="film.url">
          <strong>URL:</strong> {{ film.url }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/services/useAuth.js'
import FilmService from '@/services/filmService.js'

const router = useRouter()
const { logout } = useAuth()

const films = ref([])
const query = ref('')
const error = ref(null)

const handleLogout = async () => {
  logout()
  await navigateTo('/login')
}

const numberResultat = computed(() => films.value.length)

const searchFilm = async () => {
  if (!query.value) {
    films.value = []
    error.value = null
    return
  }

  try {
    error.value = null
    const result = await FilmService.searchFilms(query.value)
    console.log('Résultat complet:', result) // debug

    // 🔥 CORRECTION ICI : Accède à la propriété "member"
    // Ton API retourne { member: [...films] }
    films.value = result.member || result['hydra:member'] || []

    console.log('Films extraits:', films.value) // debug
  } catch (err) {
    films.value = []
    error.value = 'Erreur lors de la recherche'
    console.error('Erreur recherche:', err)
  }
}

watch(query, () => {
  if (query.value === "") {
    films.value = []
    error.value = null
  } else {
    searchFilm()
  }
})

onMounted(() => {
  const searchInput = document.getElementById('search')
  if (searchInput) searchInput.focus()
})
</script>

<style scoped>
.error {
  color: red;
  margin: 10px 0;
}

.text-black {
  color: #000 !important;
}
</style>