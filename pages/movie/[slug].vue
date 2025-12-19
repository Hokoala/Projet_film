<template>
  <div class="min-h-screen bg-gradient-to-b from-black to-gray-900">
    <div class="container mx-auto max-w-7xl px-4 py-8">
      <!-- Bouton retour -->
      <NuxtLink
          to="/movies"
          class="mb-6 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour aux films
      </NuxtLink>

      <!-- Chargement -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
        <p class="mt-4 text-xl text-gray-300">Chargement du film...</p>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="bg-red-900/50 border border-red-700 text-red-200 px-6 py-4 rounded-lg shadow-xl">
        <p class="font-bold text-lg">âš ï¸ Erreur</p>
        <p>{{ error }}</p>
      </div>

      <!-- DÃ©tails du film -->
      <div v-else-if="film" class="space-y-8">
        <!-- Hero Section -->
        <div class="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-red-900/30">
          <div class="relative md:flex gap-8 p-8">
            <!-- Affiche du film -->
            <div class="md:flex-shrink-0 md:w-1/3 mb-6 md:mb-0">
              <img
                  :src="`https://picsum.photos/seed/${film.id}/400/600`"
                  :alt="film.name"
                  class="w-full rounded-xl shadow-2xl border-4 border-red-600/50 object-cover"
                  style="height: 500px;"
              />
            </div>

            <!-- Informations dÃ©taillÃ©es -->
            <div class="md:w-2/3 space-y-6">
              <div>
                <h1 class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 mb-4">
                  {{ film.name }}
                </h1>

                <!-- Tags -->
                <div class="flex flex-wrap gap-3 mb-6">
                  <span class="px-4 py-2 bg-red-600/20 text-red-400 rounded-full text-sm font-semibold border border-red-600/30">
                    {{ formatYear(film.releaseDate) }}
                  </span>
                  <span class="px-4 py-2 bg-red-600/20 text-red-400 rounded-full text-sm font-semibold border border-red-600/30">
                    {{ formatDuration(film.duration) }}
                  </span>
                  <span v-if="film.nbEntries" class="px-4 py-2 bg-red-600/20 text-red-400 rounded-full text-sm font-semibold border border-red-600/30">
                    {{ film.nbEntries }} entrees
                  </span>
                </div>
              </div>

              <!-- Description -->
              <div class="bg-black/40 p-6 rounded-xl border border-red-900/30">
                <h2 class="text-2xl font-bold text-red-400 mb-4">Synopsis</h2>
                <p class="text-gray-300 leading-relaxed text-lg">{{ film.description || 'Aucune description disponible' }}</p>
              </div>

              <!-- Infos complÃ©mentaires -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gradient-to-br from-red-900/30 to-red-800/20 p-5 rounded-xl border border-red-700/40">
                  <p class="text-sm text-red-300 mb-1">Date de sortie</p>
                  <p class="text-lg font-bold text-white">{{ formatDate(film.releaseDate) }}</p>
                </div>

                <div class="bg-gradient-to-br from-red-900/30 to-red-800/20 p-5 rounded-xl border border-red-700/40">
                  <p class="text-sm text-red-300 mb-1">durée</p>
                  <p class="text-lg font-bold text-white">{{ formatDuration(film.duration) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Commentaires -->
        <div class="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-red-900/30">
          <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 mb-6">
            Commentaires ({{ comments.length }})
          </h2>

          <!-- Formulaire d'ajout de commentaire -->
          <div v-if="!editingComment" class="mb-8">
            <CommentForm
                :movie-id="filmId"
                @success="handleCommentSubmit"
            />
          </div>

          <!-- Formulaire d'édition -->
          <div v-else class="mb-8">
            <CommentForm
                :movie-id="filmId"
                :edit-mode="true"
                :initial-data="{ content: editingComment.content, rating: editingComment.rating }"
                @success="handleUpdateComment"
                @cancel="cancelEdit"
            />
          </div>

          <!-- Chargement des commentaires -->
          <div v-if="commentsLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
            <p class="mt-2 text-gray-400">Chargement des commentaires...</p>
          </div>

          <!-- Erreur commentaires -->
          <div v-else-if="commentsError" class="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
            {{ commentsError }}
          </div>

          <!-- Liste des commentaires -->
          <div v-else-if="comments.length > 0" class="space-y-4">
            <CommentCard
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
                @edit="handleEditComment(comment)"
                @delete="handleDeleteComment(comment.id)"
            />
          </div>

          <!-- Aucun commentaire -->
          <div v-else class="text-center py-8">
            <p class="text-gray-400">Aucun commentaire pour ce film. Soyez le premier !</p>
          </div>
        </div>
      </div>

      <!-- Film non trouvÃ© -->
      <div v-else class="text-center py-20 bg-gray-900/50 rounded-2xl border border-red-900/30">
        <p class="text-3xl text-gray-300 font-bold">Film non trouvé</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import FilmService from '@/services/filmService.js'
import CommentService from '@/services/commentService.js'
import { useSession } from '~/stores/session'
import CommentForm from '~/components/CommentForm.vue'
import CommentCard from '~/components/CommentCard.vue'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const session = useSession()

const film = ref(null)
const loading = ref(true)
const error = ref(null)
const filmId = route.params.slug

// Commentaires
const comments = ref([])
const commentsLoading = ref(false)
const commentsError = ref(null)
const editingComment = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatYear = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).getFullYear()
}

const formatDuration = (seconds) => {
  if (!seconds) return 'N/A'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }
  return `${minutes} min`
}

const fetchFilmDetails = async () => {
  try {
    loading.value = true
    error.value = null

    const result = await FilmService.getFilmById(filmId)
    film.value = result
  } catch (err) {
    // console.error('Erreur chargement film:', err)
    error.value = `Impossible de charger le film: ${err.message}`
  } finally {
    loading.value = false
  }
}

// Récupérer les commentaires du film
const fetchComments = async () => {
  try {
    commentsLoading.value = true
    commentsError.value = null

    const result = await CommentService.getMovieComments(filmId)

    if (Array.isArray(result)) {
      comments.value = result
    } else if (result['hydra:member']) {
      comments.value = result['hydra:member']
    } else if (result.member) {
      comments.value = result.member
    } else {
      comments.value = []
    }
  } catch (err) {
    // console.error('Erreur chargement commentaires:', err)
    commentsError.value = 'Impossible de charger les commentaires'
  } finally {
    commentsLoading.value = false
  }
}

// Soumettre un nouveau commentaire
const handleCommentSubmit = async (commentData) => {
  try {
    // console.log('Donnees commentaire envoyees:', commentData)
    await CommentService.createComment(commentData)
    await fetchComments()
    alert('Commentaire ajoute avec succes !')
  } catch (err) {
    // console.error('Erreur creation commentaire:', err)
    alert('Erreur: ' + err.message)
  }
}

// Modifier un commentaire
const handleEditComment = (comment) => {
  editingComment.value = comment
}

// Mettre à jour un commentaire
const handleUpdateComment = async (commentData) => {
  try {
    await CommentService.updateComment(editingComment.value.id, {
      content: commentData.content,
      rating: commentData.rating
    })
    editingComment.value = null
    await fetchComments()
  } catch (err) {
    // console.error('Erreur mise à jour commentaire:', err)
  }
}

// Supprimer un commentaire
const handleDeleteComment = async (commentId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return

  try {
    await CommentService.deleteComment(commentId)
    await fetchComments()
  } catch (err) {
    // console.error('Erreur suppression commentaire:', err)
  }
}

// Annuler l'édition
const cancelEdit = () => {
  editingComment.value = null
}

onMounted(async () => {
  session.restoreSession()
  await fetchFilmDetails()
  await fetchComments()
})
</script>