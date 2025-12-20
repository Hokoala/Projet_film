<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-red-600/20 rounded-full mb-6">
          <svg class="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-white mb-3">Mon Profil</h1>
        <p class="text-gray-400">Informations de votre compte</p>
      </div>

      <!-- Carte de profil -->
      <div class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        <div class="p-8 space-y-6">
          <!-- Nom d'utilisateur -->
          <div class="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
            <div class="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Nom d'utilisateur</p>
              <p class="text-white font-medium text-lg">{{ session.userName || 'Non renseigné' }}</p>
            </div>
          </div>

          <!-- Email -->
          <div class="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
            <div class="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Email</p>
              <p class="text-white font-medium text-lg">{{ session.user?.email || 'Non renseigné' }}</p>
            </div>
          </div>

          <!-- Role -->
          <div class="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
            <div class="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Role</p>
              <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mt-1"
                    :class="{
                      'bg-red-600/20 text-red-400 border border-red-600/30': session.isAdmin,
                      'bg-blue-600/20 text-blue-400 border border-blue-600/30': !session.isAdmin
                    }">
                {{ session.userRole?.toUpperCase() || 'UTILISATEUR' }}
              </span>
            </div>
          </div>

          <!-- Statut de connexion -->
          <div class="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
            <div class="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Statut</p>
              <p class="text-green-400 font-medium text-lg">Connecté</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="p-8 pt-0 space-y-4">
          <button
              @click="handleLogout"
              class="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-600/30"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Se déconnecter
          </button>
        </div>
      </div>

      <!-- Lien retour -->
      <div class="text-center mt-8">
        <NuxtLink to="/" class="text-gray-400 hover:text-red-500 transition inline-flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Retour à l'accueil
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSession } from '~/stores/session'
import { useRouter } from 'vue-router'

const session = useSession()
const router = useRouter()

onMounted(() => {
  session.restoreSession()

  if (!session.isAuthenticated) {
    router.push('/login')
  }
})

const handleLogout = () => {
  session.logout()
  router.push('/')
}
</script>
