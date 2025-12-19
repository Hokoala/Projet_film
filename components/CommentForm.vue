<template>
  <div class="bg-gray-900/70 backdrop-blur-sm rounded-lg p-6 border border-red-900/50">
    <h3 class="text-xl font-bold text-white mb-4">
      {{ editMode ? 'Modifier votre commentaire' : 'Ajouter un commentaire' }}
    </h3>

    <!-- Message si non connecté -->
    <div v-if="!session.isAuthenticated" class="text-center py-6">
      <p class="text-gray-400 mb-4">Vous devez être connecté pour laisser un commentaire</p>
      <NuxtLink
          to="/login"
          class="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition"
      >
        Se connecter
      </NuxtLink>
    </div>

    <!-- Formulaire -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Note -->
      <div>
        <label class="block text-sm font-medium text-red-300 mb-2">
          Votre note *
        </label>
        <StarRating v-model="formData.rating" />
      </div>

      <!-- Commentaire -->
      <div>
        <label for="comment-content" class="block text-sm font-medium text-red-300 mb-2">
          Votre avis *
        </label>
        <textarea
            id="comment-content"
            v-model="formData.content"
            rows="4"
            required
            maxlength="1000"
            class="w-full px-4 py-3 bg-gray-800 border border-red-900/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-600 focus:border-transparent"
            placeholder="Partagez votre avis sur ce film..."
        ></textarea>
        <p class="text-xs text-gray-500 mt-1">
          {{ formData.content.length }} / 1000 caractères
        </p>
      </div>

      <!-- Messages d'erreur/succès -->
      <div v-if="error" class="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
        {{ error }}
      </div>

      <div v-if="success" class="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded">
        {{ success }}
      </div>

      <!-- Boutons -->
      <div class="flex gap-3">
        <button
            type="submit"
            :disabled="loading || !formData.rating || !formData.content.trim()"
            class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Envoi...' : editMode ? 'Mettre à jour' : 'Publier' }}
        </button>

        <button
            v-if="editMode"
            type="button"
            @click="$emit('cancel')"
            class="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition"
        >
          Annuler
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useSession } from '~/stores/session'
import StarRating from './StarRating.vue'

const props = defineProps({
  movieId: {
    type: [String, Number],
    required: true
  },
  editMode: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['success', 'cancel'])

const session = useSession()

const loading = ref(false)
const error = ref(null)
const success = ref(null)

const formData = reactive({
  content: props.initialData.content || '',
  rating: props.initialData.rating || 0
})

// Réinitialiser le formulaire quand initialData change
watch(() => props.initialData, (newData) => {
  formData.content = newData.content || ''
  formData.rating = newData.rating || 0
}, { deep: true })

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  success.value = null

  try {
    // Validation
    if (!formData.rating) {
      error.value = 'Veuillez sélectionner une note'
      return
    }
    if (!formData.content.trim()) {
      error.value = 'Veuillez écrire un commentaire'
      return
    }
    if (formData.content.length > 1000) {
      error.value = 'Le commentaire ne doit pas dépasser 1000 caractères'
      return
    }

    // Données à envoyer (format IRI pour API Platform)
    // L'utilisateur est injecté automatiquement via JWT par CommentUserProcessor
    const commentData = {
      content: formData.content.trim(),
      rating: parseInt(formData.rating),
      movie: `/api/movies/${props.movieId}`
    }

    console.log('📤 Envoi commentaire:', commentData)
    emit('success', commentData)

    // Réinitialiser le formulaire si création
    if (!props.editMode) {
      formData.content = ''
      formData.rating = 0
      success.value = 'Commentaire publié avec succès !'

      setTimeout(() => {
        success.value = null
      }, 3000)
    }
  } catch (err) {
    console.error('Erreur lors de l\'envoi du commentaire:', err)
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>