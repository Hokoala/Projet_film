<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-red-600/20 rounded-2xl mb-6">
          <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-white mb-3">
          {{ isEditing ? 'Modifier le film' : 'Ajouter un film' }}
        </h1>
        <p class="text-gray-400">Remplissez les informations du film</p>

        <!-- Badge de role -->
        <div class="mt-4">
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                :class="{
                  'bg-red-600/20 text-red-400 border border-red-600/30': session.isAdmin,
                  'bg-blue-600/20 text-blue-400 border border-blue-600/30': !session.isAdmin
                }">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
            </svg>
            {{ session.userRole.toUpperCase() }}
          </span>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-xl text-red-400">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>{{ errorMessage }}</span>
          <button @click="errorMessage = ''" class="ml-auto text-red-400 hover:text-red-300">×</button>
        </div>
      </div>

      <!-- Message de succès -->
      <div v-if="successMessage" class="mb-6 p-4 bg-green-600/20 border border-green-600/50 rounded-xl text-green-400">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span>{{ successMessage }}</span>
          <button @click="successMessage = ''" class="ml-auto text-green-400 hover:text-green-300">×</button>
        </div>
      </div>

      <!-- Formulaire -->
      <div class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        <form @submit.prevent="handleSubmit" class="p-8 space-y-8">

          <!-- Section: Informations principales -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 pb-4 border-b border-gray-700">
              <div class="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-white">Informations principales</h2>
            </div>

            <!-- Titre (name dans l'API) -->
            <div class="form-group">
              <label for="name" class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"/>
                </svg>
                Titre du film <span class="text-red-500">*</span>
              </label>
              <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="form-input"
                  placeholder="Ex: Inception"
              />
            </div>

            <!-- Description -->
            <div class="form-group">
              <label for="description" class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
                </svg>
                Description <span class="text-red-500">*</span>
              </label>
              <textarea
                  id="description"
                  v-model="form.description"
                  rows="4"
                  required
                  class="form-input resize-none"
                  placeholder="Resume du film..."
              ></textarea>
            </div>

            <!-- Grille: Réalisateur & Date & Durée -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Réalisateur (select) -->
              <div class="form-group">
                <label for="director" class="form-label">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  Réalisateur <span class="text-red-500">*</span>
                </label>
                <select
                    id="director"
                    v-model="form.directorId"
                    required
                    class="form-input"
                >
                  <option value="" disabled>Sélectionner un réalisateur</option>
                  <option
                      v-for="director in directors"
                      :key="director.id || director['@id']"
                      :value="director.id || director['@id']"
                  >
                    {{ director.firstname || director.name }} {{ director.lastname || '' }}
                  </option>
                </select>
              </div>

              <!-- Date de sortie -->
              <div class="form-group">
                <label for="releaseDate" class="form-label">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Date de sortie
                </label>
                <input
                    id="releaseDate"
                    v-model="form.releaseDate"
                    type="date"
                    class="form-input"
                />
              </div>

              <!-- Durée -->
              <div class="form-group">
                <label for="duration" class="form-label">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Durée (minutes)
                </label>
                <input
                    id="duration"
                    v-model.number="form.duration"
                    type="number"
                    min="1"
                    class="form-input"
                    placeholder="Ex: 120"
                />
              </div>
            </div>

            <!-- Grille: Budget & Entrées -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Budget -->
              <div class="form-group">
                <label for="budget" class="form-label">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Budget (€)
                </label>
                <input
                    id="budget"
                    v-model.number="form.budget"
                    type="number"
                    min="0"
                    step="0.01"
                    class="form-input"
                    placeholder="Ex: 150000000"
                />
              </div>

              <!-- Nombre d'entrées -->
              <div class="form-group">
                <label for="nbEntries" class="form-label">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Nombre d'entrées
                </label>
                <input
                    id="nbEntries"
                    v-model.number="form.nbEntries"
                    type="number"
                    min="0"
                    class="form-input"
                    placeholder="Ex: 5000000"
                />
              </div>
            </div>

            <!-- URL du site -->
            <div class="form-group">
              <label for="url" class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
                URL du site officiel
              </label>
              <input
                  id="url"
                  v-model="form.url"
                  type="url"
                  class="form-input"
                  placeholder="https://www.example.com/film"
              />
            </div>
          </div>

          <!-- Section: Poster -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 pb-4 border-b border-gray-700">
              <div class="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-white">Poster du film</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Zone d'upload -->
              <div class="space-y-4">
                <!-- Upload button -->
                <label
                    for="poster-upload"
                    class="upload-zone"
                    :class="{ 'uploading': isUploading }"
                >
                  <div v-if="!isUploading" class="text-center">
                    <div class="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                    </div>
                    <p class="text-white font-medium mb-1">Cliquez pour uploader</p>
                    <p class="text-gray-500 text-sm">PNG, JPG jusqu'à 5MB</p>
                  </div>
                  <div v-else class="text-center">
                    <div class="spinner-large mx-auto mb-4"></div>
                    <p class="text-white font-medium">Upload en cours...</p>
                  </div>
                </label>
                <input
                    id="poster-upload"
                    type="file"
                    accept="image/*"
                    @change="handlePosterUpload"
                    hidden
                    :disabled="isUploading"
                />

                <!-- Info upload réussi -->
                <div v-if="form.imageId" class="p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
                  <div class="flex items-center gap-2 text-green-400 text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Image uploadée</span>
                  </div>
                </div>
              </div>

              <!-- Aperçu -->
              <div class="flex flex-col items-center justify-center">
                <div v-if="posterPreview || form.imageUrl" class="relative group">
                  <img
                      :src="posterPreview || form.imageUrl"
                      alt="Aperçu du poster"
                      class="w-48 h-72 object-cover rounded-xl shadow-2xl border-2 border-gray-700 group-hover:border-red-600 transition-all"
                      @error="handleImageError"
                  />
                  <button
                      type="button"
                      @click="removePoster"
                      class="absolute -top-3 -right-3 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110"
                      :disabled="isRemoving"
                  >
                    <svg v-if="!isRemoving" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    <span v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  </button>
                </div>
                <div v-else class="w-48 h-72 bg-gray-800 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center">
                  <div class="text-center text-gray-500">
                    <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p class="text-sm">Aperçu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section: Auteur -->
          <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <p class="text-white font-medium">{{ session.userName }}</p>
                <p class="text-gray-400 text-sm">{{ session.user?.email }}</p>
              </div>
              <div class="ml-auto">
                <span class="text-xs text-gray-500 bg-gray-700/50 px-3 py-1 rounded-full">Auteur</span>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-4 pl-16">Ce contenu sera associé à votre compte</p>
          </div>

          <!-- Boutons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
            <button
                type="submit"
                class="flex-1 btn-primary"
                :disabled="isUploading || isSubmitting"
            >
              <svg v-if="isSubmitting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ isSubmitting ? 'En cours...' : (isEditing ? 'Mettre à jour' : 'Créer le film') }}
            </button>
            <button
                type="button"
                @click="$router.back()"
                class="flex-1 sm:flex-none btn-secondary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Annuler
            </button>
          </div>
        </form>
      </div>

      <!-- Lien retour -->
      <div class="text-center mt-8">
        <NuxtLink to="/movies" class="text-gray-400 hover:text-red-500 transition inline-flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Retour à la liste des films
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSession } from '~/stores/session'
import { useRouter, useRoute } from 'vue-router'
import filmService from '~/services/filmService'
import directorService from '~/services/directorService'

const API_URL = 'http://localhost:8319'

const session = useSession()
const router = useRouter()
const route = useRoute()

const isUploading = ref(false)
const isSubmitting = ref(false)
const isRemoving = ref(false)
const posterPreview = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const directors = ref([])

// Charger les réalisateurs au montage
onMounted(async () => {
  session.restoreSession()

  // Vérifier l'authentification
  if (!session.isAuthenticated) {
    alert('Vous devez être connecté pour créer du contenu')
    router.push('/login')
    return
  }

  // Vérifier les permissions (admin seulement)
  if (!session.isAdmin) {
    alert('Vous n\'avez pas les permissions nécessaires')
    router.push('/')
    return
  }

  // Charger la liste des réalisateurs
  try {
    const response = await directorService.getAllDirectors()
    directors.value = response['hydra:member'] || response.member || response || []
    // console.log('✅ Réalisateurs chargés:', directors.value.length)
  } catch (error) {
    // console.error('❌ Erreur chargement réalisateurs:', error)
    errorMessage.value = 'Impossible de charger la liste des réalisateurs'
  }
})

const isEditing = ref(false)
const filmId = ref(null)

// Formulaire avec les champs correspondant à l'API
const form = ref({
  name: '',
  description: '',
  duration: null,
  releaseDate: '',
  directorId: '',
  nbEntries: 0,
  url: '',
  budget: null,
  imageId: null,
  imageUrl: ''
})

// Gérer les erreurs de chargement d'image
const handleImageError = () => {
  // console.warn('⚠️ Erreur chargement image')
  posterPreview.value = ''
}

/**
 * Upload du poster vers /api/media_objects
 */
const handlePosterUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  errorMessage.value = ''
  successMessage.value = ''

  // Validation
  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Veuillez sélectionner une image (JPG, PNG, GIF...)'
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'L\'image ne doit pas dépasser 5MB'
    return
  }

  const token = session.token || localStorage.getItem('token')
  if (!token) {
    errorMessage.value = 'Vous devez être connecté pour uploader une image'
    return
  }

  // Aperçu immédiat
  const reader = new FileReader()
  reader.onload = (e) => posterPreview.value = e.target?.result
  reader.readAsDataURL(file)

  isUploading.value = true

  try {
    // console.log('📤 Upload du fichier vers media_objects...')

    const formData = new FormData()
    formData.append('file', file)

    const uploadResponse = await fetch(`${API_URL}/api/media_objects`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/ld+json'
        // ⚠️ PAS de Content-Type pour FormData !
      }
    })

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({}))
      // console.error('❌ Erreur upload:', errorData)

      if (uploadResponse.status === 401) {
        throw new Error('Session expirée, veuillez vous reconnecter')
      }
      if (uploadResponse.status === 415) {
        throw new Error('Format de fichier non supporté')
      }
      throw new Error(errorData.detail || `Erreur upload: ${uploadResponse.status}`)
    }

    const mediaData = await uploadResponse.json()
    // console.log('✅ Media uploadé:', mediaData)

    // Récupérer l'IRI et l'URL
    const mediaIri = mediaData['@id'] || `/api/media_objects/${mediaData.id}`
    let imageUrl = mediaData.contentUrl || mediaData.filePath || mediaData.url

    if (imageUrl && imageUrl.startsWith('/')) {
      imageUrl = API_URL + imageUrl
    }

    // console.log('📎 Media IRI:', mediaIri)
    // console.log('🖼️ Image URL:', imageUrl)

    form.value.imageId = mediaIri
    form.value.imageUrl = imageUrl
    posterPreview.value = imageUrl

    successMessage.value = 'Image uploadée avec succès !'

  } catch (error) {
    // console.error('❌ Erreur:', error)
    errorMessage.value = error.message || 'Erreur lors de l\'upload'
    posterPreview.value = ''
    form.value.imageId = null
    form.value.imageUrl = ''
  } finally {
    isUploading.value = false
    event.target.value = ''
  }
}

/**
 * Supprimer le poster uploadé
 */
const removePoster = async () => {
  if (!form.value.imageId) {
    posterPreview.value = ''
    return
  }

  const token = session.token || localStorage.getItem('token')
  if (!token) return

  isRemoving.value = true

  try {
    const mediaId = form.value.imageId.toString().includes('/')
        ? form.value.imageId.split('/').pop()
        : form.value.imageId

    // console.log('🗑️ Suppression du media_object:', mediaId)

    const deleteResponse = await fetch(`${API_URL}/api/media_objects/${mediaId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/ld+json'
      }
    })

    if (deleteResponse.ok || deleteResponse.status === 204) {
      // console.log('✅ Media_object supprimé')
    }
  } catch (e) {
    // console.warn('⚠️ Erreur suppression:', e)
  } finally {
    form.value.imageId = null
    form.value.imageUrl = ''
    posterPreview.value = ''
    isRemoving.value = false
  }
}

/**
 * Soumettre le formulaire
 */
const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isSubmitting.value = true

  try {
    const filmData = {
      name: form.value.name,
      description: form.value.description,
      duration: form.value.duration ? parseInt(form.value.duration) : 0,
      releaseDate: form.value.releaseDate || null,
      nbEntries: form.value.nbEntries ? parseInt(form.value.nbEntries) : 0,
      url: form.value.url || null,
      budget: form.value.budget ? parseFloat(form.value.budget) : 0
    }

    // Ajouter le réalisateur (IRI format)
    if (form.value.directorId) {
      const directorId = form.value.directorId.toString()
      filmData.director = directorId.startsWith('/api/')
          ? directorId
          : `/api/directors/${directorId}`
    }

    // Ajouter l'image si uploadée (IRI format)
    if (form.value.imageId) {
      filmData.image = form.value.imageId
    }

    // console.log('📤 Données envoyées:', filmData)

    if (isEditing.value) {
      await filmService.updateFilm(filmId.value, filmData)
      successMessage.value = 'Film mis à jour avec succès !'
    } else {
      await filmService.createFilm(filmData)
      successMessage.value = 'Film créé avec succès !'
    }

    setTimeout(() => router.push('/movies'), 1500)

  } catch (error) {
    // console.error('❌ Erreur:', error)
    errorMessage.value = `Erreur: ${error.message}`
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply flex items-center gap-2 text-sm font-medium text-gray-300;
}

.form-input {
  @apply w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 transition-all duration-300;
  @apply focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20;
  @apply hover:border-gray-600;
}

select.form-input {
  @apply appearance-none cursor-pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

select.form-input option {
  @apply bg-gray-800 text-white;
}

.btn-primary {
  @apply inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300;
  @apply shadow-lg hover:shadow-red-600/30 transform hover:-translate-y-0.5;
  @apply disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
}

.btn-secondary {
  @apply inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-300;
  @apply border border-gray-600 hover:border-gray-500;
}

.upload-zone {
  @apply block w-full p-8 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer transition-all duration-300;
  @apply hover:border-red-600 hover:bg-red-600/5;
}

.upload-zone.uploading {
  @apply border-red-600 bg-red-600/5 cursor-wait;
}

.spinner-large {
  @apply w-12 h-12 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin;
}
</style>