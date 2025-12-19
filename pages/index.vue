<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
    <!-- Hero Section avec Carrousel de Films -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <!-- Carrousel d'images de films en arrière-plan -->
      <div class="absolute inset-0">
        <TransitionGroup name="hero-slide">
          <div
            v-for="(movie, index) in heroMovies"
            v-show="index === currentSlide"
            :key="movie.id"
            class="absolute inset-0"
          >
            <img
              :src="movie.poster || `https://picsum.photos/seed/${movie.id}/1920/1080`"
              :alt="movie.name || movie.title"
              class="w-full h-full object-cover"
            />
          </div>
        </TransitionGroup>
      </div>

      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/50"></div>

      <!-- Contenu Hero -->
      <div class="relative z-10 w-full max-w-7xl mx-auto px-4 flex items-center">
        <div class="max-w-2xl">
          <!-- Info du film actuel -->
          <div v-if="heroMovies.length > 0" class="mb-6">
            <span class="inline-block px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full mb-4">
              A l'affiche
            </span>
            <h1 class="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight leading-tight">
              {{ heroMovies[currentSlide]?.name || heroMovies[currentSlide]?.title || 'Utopia Cinema' }}
            </h1>
            <p class="text-lg text-gray-300 mb-2">
              {{ getYear(heroMovies[currentSlide]?.releaseDate || heroMovies[currentSlide]?.released) }}
            </p>
            <p class="text-xl text-gray-400 mb-8 line-clamp-3">
              {{ heroMovies[currentSlide]?.description || 'Decouvrez ce film sur Utopia Cinema' }}
            </p>
          </div>

          <!-- Fallback si pas de films -->
          <div v-else class="mb-6">
            <h1 class="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
              Utopia <span class="text-red-600">Cinema</span>
            </h1>
            <p class="text-xl text-gray-400 mb-8">
              Explorez des milliers de films, decouvrez les realisateurs legendaires
              et les acteurs qui ont marque l'histoire du cinema.
            </p>
          </div>

          <!-- Boutons d'action -->
          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink
              v-if="heroMovies.length > 0"
              :to="`/movie/${heroMovies[currentSlide]?.id}`"
              class="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-red-600/50 flex items-center justify-center gap-3"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
              </svg>
              Voir le film
            </NuxtLink>
            <NuxtLink
              v-if="!session.isAuthenticated"
              to="/login"
              class="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-lg font-semibold rounded-xl transition-all border border-white/20"
            >
              Se connecter
            </NuxtLink>
            <NuxtLink
              to="/movies"
              class="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-lg font-semibold rounded-xl transition-all border border-white/20"
            >
              Explorer les films
            </NuxtLink>
          </div>

          <!-- Indicateurs de slide -->
          <div v-if="heroMovies.length > 1" class="flex gap-2 mt-8">
            <button
              v-for="(movie, index) in heroMovies"
              :key="movie.id"
              @click="currentSlide = index"
              class="w-16 h-1 rounded-full transition-all"
              :class="index === currentSlide ? 'bg-red-600' : 'bg-white/30 hover:bg-white/50'"
            />
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </div>
    </section>

    <!-- Section Categories -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-white text-center mb-4">Explorez notre univers</h2>
        <p class="text-gray-400 text-center mb-12 text-lg">Tout ce dont vous avez besoin pour votre passion du cinema</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Films -->
          <NuxtLink to="/movies" class="group">
            <div class="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 transition-all duration-300 hover:border-red-600 hover:shadow-2xl hover:shadow-red-900/20 hover:-translate-y-2">
              <div class="w-16 h-16 bg-red-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600/30 transition">
                <svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">Films</h3>
              <p class="text-gray-400 mb-4">Parcourez notre catalogue complet de films, des classiques aux dernieres sorties.</p>
              <span class="text-red-500 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                Voir les films
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </span>
            </div>
          </NuxtLink>

          <!-- Realisateurs -->
          <NuxtLink to="/directors" class="group">
            <div class="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 transition-all duration-300 hover:border-red-600 hover:shadow-2xl hover:shadow-red-900/20 hover:-translate-y-2">
              <div class="w-16 h-16 bg-red-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600/30 transition">
                <svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">Realisateurs</h3>
              <p class="text-gray-400 mb-4">Decouvrez les maitres du cinema et explorez leur filmographie complete.</p>
              <span class="text-red-500 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                Voir les realisateurs
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </span>
            </div>
          </NuxtLink>

          <!-- Acteurs -->
          <NuxtLink to="/actors" class="group">
            <div class="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 transition-all duration-300 hover:border-red-600 hover:shadow-2xl hover:shadow-red-900/20 hover:-translate-y-2">
              <div class="w-16 h-16 bg-red-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600/30 transition">
                <svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">Acteurs</h3>
              <p class="text-gray-400 mb-4">Retrouvez vos acteurs preferes et decouvrez tous leurs films.</p>
              <span class="text-red-500 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                Voir les acteurs
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section Films Recents (si connecte) -->
    <section v-if="session.isAuthenticated" class="py-20 px-4 bg-black/50">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-4xl font-bold text-white mb-2">Films recents</h2>
            <p class="text-gray-400">Les derniers films ajoutes a notre catalogue</p>
          </div>
          <NuxtLink to="/movies" class="text-red-500 hover:text-red-400 font-semibold flex items-center gap-2">
            Voir tout
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </NuxtLink>
        </div>

        <!-- Chargement -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-red-600"></div>
        </div>

        <!-- Films -->
        <div v-else-if="recentMovies.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <NuxtLink
            v-for="movie in recentMovies"
            :key="movie.id"
            :to="`/movie/${movie.id}`"
            class="group"
          >
            <div class="relative overflow-hidden rounded-xl bg-gray-800 shadow-lg hover:shadow-2xl hover:shadow-red-900/30 transition-all duration-300 transform hover:-translate-y-2">
              <div class="relative overflow-hidden">
                <img
                  :src="movie.poster || `https://picsum.photos/seed/${movie.id}/300/450`"
                  :alt="movie.name || movie.title"
                  class="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div class="p-4">
                <h3 class="font-bold text-white truncate">{{ movie.name || movie.title }}</h3>
                <p class="text-gray-400 text-sm">{{ getYear(movie.releaseDate || movie.released) }}</p>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Aucun film -->
        <div v-else class="text-center py-12 text-gray-400">
          <p>Aucun film disponible pour le moment</p>
        </div>
      </div>
    </section>

    <!-- Section Statistiques -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-white text-center mb-12">Utopia en chiffres</h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 text-center hover:border-red-600/50 transition">
            <div class="text-5xl font-black text-red-600 mb-2">{{ stats.movies }}+</div>
            <div class="text-gray-400 font-medium">Films</div>
          </div>
          <div class="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 text-center hover:border-red-600/50 transition">
            <div class="text-5xl font-black text-red-600 mb-2">{{ stats.directors }}+</div>
            <div class="text-gray-400 font-medium">Realisateurs</div>
          </div>
          <div class="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 text-center hover:border-red-600/50 transition">
            <div class="text-5xl font-black text-red-600 mb-2">{{ stats.actors }}+</div>
            <div class="text-gray-400 font-medium">Acteurs</div>
          </div>
          <div class="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 text-center hover:border-red-600/50 transition">
            <div class="text-5xl font-black text-red-600 mb-2">{{ stats.users }}+</div>
            <div class="text-gray-400 font-medium">Utilisateurs</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Admin (si admin connecte) -->
    <section v-if="session.isAdmin" class="py-16 px-4 bg-gradient-to-r from-red-900/20 to-gray-900">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Espace Administration</h2>
        <p class="text-gray-400 mb-8">Gerez le contenu de la plateforme</p>

        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="/films/create"
            class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Ajouter un film
          </NuxtLink>
          <NuxtLink
            to="/movies"
            class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
            Gerer les films
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section CTA (si non connecte) -->
    <section v-if="!session.isAuthenticated" class="py-20 px-4 bg-gradient-to-r from-red-900/30 to-gray-900">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-white mb-6">Pret a commencer ?</h2>
        <p class="text-xl text-gray-300 mb-10">
          Rejoignez Utopia Cinema et accedez a tout notre catalogue de films,
          realisateurs et acteurs.
        </p>
        <NuxtLink
          to="/register"
          class="inline-block px-12 py-4 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-red-600/50"
        >
          Creer mon compte gratuitement
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSession } from '~/stores/session'
import filmService from '~/services/filmService'

const session = useSession()

const loading = ref(false)
const recentMovies = ref([])
const heroMovies = ref([])
const currentSlide = ref(0)
let slideInterval = null

const stats = ref({
  movies: 0,
  directors: 50,
  actors: 200,
  users: 100
})

const getYear = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).getFullYear()
  } catch {
    return ''
  }
}

const startSlideShow = () => {
  if (heroMovies.value.length > 1) {
    slideInterval = setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % heroMovies.value.length
    }, 6000)
  }
}

const loadMovies = async () => {
  loading.value = true
  try {
    const response = await filmService.getAllFilms()

    let movies = []
    if (response['hydra:member']) {
      movies = response['hydra:member']
    } else if (response.member) {
      movies = response.member
    } else if (Array.isArray(response)) {
      movies = response
    }

    // Films pour le hero (les 5 premiers)
    heroMovies.value = movies.slice(0, 5)

    // Films recents (si connecte)
    if (session.isAuthenticated) {
      recentMovies.value = movies.slice(0, 5)
    }

    stats.value.movies = movies.length

    // Demarrer le carrousel
    startSlideShow()
  } catch (error) {
    // console.error('Erreur chargement films:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (process.client) {
    session.restoreSession()
  }

  await loadMovies()
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
})
</script>

<style scoped>
/* Animation pour le hero */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

section:first-child > div:last-child {
  animation: fadeInUp 1s ease-out;
}

/* Transitions du carrousel */
.hero-slide-enter-active,
.hero-slide-leave-active {
  transition: opacity 1s ease-in-out;
}

.hero-slide-enter-from,
.hero-slide-leave-to {
  opacity: 0;
}

.hero-slide-enter-to,
.hero-slide-leave-from {
  opacity: 1;
}

/* Line clamp pour la description */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
