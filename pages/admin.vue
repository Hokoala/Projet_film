<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/authService'

const router = useRouter()

// Vérifier l'authentification admin
const isAdmin = computed(() => {
  // À adapter selon votre logique d'authentification
  return AuthService.user.value?.role === 'admin'
})

// Redirection si pas admin
onMounted(() => {
  if (!isAdmin.value) {
    router.push('/')
  }
})

// État des onglets
const activeTab = ref<'movies' | 'users' | 'comments'>('movies')

// Données
const movies = ref<any[]>([])
const users = ref<any[]>([])
const comments = ref<any[]>([])

const stats = computed(() => ({
  totalMovies: movies.value.length,
  totalUsers: users.value.length,
  totalComments: comments.value.length,
  pendingComments: comments.value.filter(c => !c.approved).length
}))

// Chargement des données
const loadMovies = async () => {
  try {
    // Remplacer par votre API
    const response = await fetch('/api/admin/movies')
    movies.value = await response.json()
  } catch (error) {
    console.error('Erreur chargement films:', error)
  }
}

const loadUsers = async () => {
  try {
    const response = await fetch('/api/admin/users')
    users.value = await response.json()
  } catch (error) {
    console.error('Erreur chargement utilisateurs:', error)
  }
}

const loadComments = async () => {
  try {
    const response = await fetch('/api/admin/comments')
    comments.value = await response.json()
  } catch (error) {
    console.error('Erreur chargement commentaires:', error)
  }
}

// Actions sur les films
const deleteMovie = async (id: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) return

  try {
    await fetch(`/api/admin/movies/${id}`, { method: 'DELETE' })
    movies.value = movies.value.filter(m => m.id !== id)
  } catch (error) {
    console.error('Erreur suppression:', error)
  }
}

const editMovie = (id: number) => {
  router.push(`/movie/edit/${id}`)
}

// Actions sur les utilisateurs
const toggleUserStatus = async (id: number) => {
  try {
    const user = users.value.find(u => u.id === id)
    await fetch(`/api/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !user.active })
    })
    user.active = !user.active
  } catch (error) {
    console.error('Erreur changement statut:', error)
  }
}

const deleteUser = async (id: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return

  try {
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    users.value = users.value.filter(u => u.id !== id)
  } catch (error) {
    console.error('Erreur suppression:', error)
  }
}

// Actions sur les commentaires
const approveComment = async (id: number) => {
  try {
    await fetch(`/api/admin/comments/${id}/approve`, { method: 'PATCH' })
    const comment = comments.value.find(c => c.id === id)
    if (comment) comment.approved = true
  } catch (error) {
    console.error('Erreur approbation:', error)
  }
}

const deleteComment = async (id: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return

  try {
    await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
    comments.value = comments.value.filter(c => c.id !== id)
  } catch (error) {
    console.error('Erreur suppression:', error)
  }
}

// Chargement initial
onMounted(() => {
  loadMovies()
  loadUsers()
  loadComments()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Back Office</h1>
          <button
              @click="router.push('/')"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Retour au site
          </button>
        </div>
      </div>
    </header>

    <!-- Statistiques -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total Films</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalMovies }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Utilisateurs</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Commentaires</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalComments }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">En attente</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.pendingComments }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Onglets -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
              @click="activeTab = 'movies'"
              :class="[
              activeTab === 'movies'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Films
          </button>
          <button
              @click="activeTab = 'users'"
              :class="[
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Utilisateurs
          </button>
          <button
              @click="activeTab = 'comments'"
              :class="[
              activeTab === 'comments'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Commentaires
            <span v-if="stats.pendingComments > 0" class="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs">
              {{ stats.pendingComments }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Contenu des onglets -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Onglet Films -->
      <div v-if="activeTab === 'movies'" class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Gestion des films</h3>
            <button
                @click="router.push('/movie/create')"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              + Ajouter un film
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Réalisateur</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Année</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="movie in movies" :key="movie.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ movie.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ movie.director }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ movie.year }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                      @click="editMovie(movie.id)"
                      class="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Modifier
                  </button>
                  <button
                      @click="deleteMovie(movie.id)"
                      class="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Onglet Utilisateurs -->
      <div v-if="activeTab === 'users'" class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Gestion des utilisateurs</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span
                        :class="[
                        user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                        'px-2 py-1 text-xs font-medium rounded-full'
                      ]"
                    >
                      {{ user.active ? 'Actif' : 'Inactif' }}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                      @click="toggleUserStatus(user.id)"
                      class="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    {{ user.active ? 'Désactiver' : 'Activer' }}
                  </button>
                  <button
                      @click="deleteUser(user.id)"
                      class="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Onglet Commentaires -->
      <div v-if="activeTab === 'comments'" class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Gestion des commentaires</h3>
          <div class="space-y-4">
            <div
                v-for="comment in comments"
                :key="comment.id"
                class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="font-medium text-gray-900">{{ comment.user }}</span>
                    <span class="text-sm text-gray-500">sur {{ comment.movieTitle }}</span>
                    <span
                        v-if="!comment.approved"
                        class="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                    >
                      En attente
                    </span>
                  </div>
                  <p class="text-gray-700">{{ comment.content }}</p>
                  <p class="text-xs text-gray-400 mt-2">{{ comment.date }}</p>
                </div>
                <div class="flex gap-2 ml-4">
                  <button
                      v-if="!comment.approved"
                      @click="approveComment(comment.id)"
                      class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Approuver
                  </button>
                  <button
                      @click="deleteComment(comment.id)"
                      class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles déjà gérés par Tailwind */
</style>
