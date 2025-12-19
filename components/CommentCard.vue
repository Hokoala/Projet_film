<template>
  <div class="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-red-900/30 hover:border-red-700/50 transition">
    <!-- En-tête avec auteur et date -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <img
            :src="userAvatar"
            :alt="userName"
            class="w-10 h-10 rounded-full border-2 border-red-600"
        />
        <div>
          <p class="font-semibold text-white">{{ userName }}</p>
          <p class="text-sm text-gray-400">{{ formattedDate }}</p>
        </div>
      </div>

    </div>

    <!-- Note avec étoiles -->
    <div v-if="comment.rating" class="mb-3">
      <StarRating :model-value="comment.rating" readonly show-value />
    </div>

    <!-- Contenu du commentaire -->
    <p class="text-gray-300 leading-relaxed">{{ comment.content }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StarRating from './StarRating.vue'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})


// Nom de l'utilisateur
const userName = computed(() => {
  if (props.comment.user?.firstname && props.comment.user?.lastname) {
    return `${props.comment.user.firstname} ${props.comment.user.lastname}`
  }
  if (props.comment.user?.email) {
    return props.comment.user.email.split('@')[0]
  }
  return 'Utilisateur'
})

// Avatar de l'utilisateur
const userAvatar = computed(() => {
  const name = userName.value
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dc2626&color=fff`
})

// Date formatée
const formattedDate = computed(() => {
  if (!props.comment.createdAt) return ''

  const date = new Date(props.comment.createdAt)
  const now = new Date()
  const diffInMs = now - date
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `Il y a ${diffInMinutes} min`
    }
    return `Il y a ${diffInHours}h`
  } else if (diffInDays === 1) {
    return 'Hier'
  } else if (diffInDays < 7) {
    return `Il y a ${diffInDays} jours`
  }

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

</script>