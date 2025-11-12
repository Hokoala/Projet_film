<script setup lang="ts">
import { computed } from 'vue'
import { useSession } from '~/stores/session.js'

// Utiliser directement le store au lieu de useAuth()
const session = useSession()

// Computed properties réactifs
const isAuthenticated = computed(() => session.loggedIn)
const currentUser = computed(() => session.user)

const handleLogout = async () => {
  session.logout()
  await navigateTo('/')
}
</script>

<template>
  <nav class="bg-white shadow-md border-b">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Menu principal -->
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="text-xl font-bold">
             UTOPIA
          </NuxtLink>

          <div class="flex items-center gap-4">
            <NuxtLink
                to="/"
                class="text-gray-600 hover:text-gray-900 font-medium transition"
            >
              Accueil
            </NuxtLink>

            <NuxtLink
                to="/movies"
                class="text-gray-600 hover:text-gray-900 font-medium transition"
            >
              Films
            </NuxtLink>

            <NuxtLink
                v-if="isAuthenticated && currentUser?.role === 'admin'"
                to="/admin"
                class="text-gray-600 hover:text-gray-900 font-medium transition"
            >
              Administration
            </NuxtLink>
          </div>
        </div>

        <!-- Section utilisateur -->
        <div class="flex items-center gap-4">
          <!-- Debug (à retirer en production) -->
          <div v-if="false" class="text-xs text-gray-400">
            Auth: {{ isAuthenticated }} | User: {{ currentUser?.name }}
          </div>

          <!-- Si connecté -->
          <template v-if="isAuthenticated && currentUser">
            <div class="flex items-center gap-3">
              <!-- Avatar -->
              <img
                  :src="currentUser.avatar"
                  :alt="currentUser.name"
                  class="w-10 h-10 rounded-full border-2 border-indigo-200"
              />

              <!-- Info utilisateur (desktop) -->
              <div class="hidden md:block">
                <p class="text-sm font-semibold text-gray-900">{{ currentUser.name }}</p>
                <p class="text-xs text-gray-500 capitalize">{{ currentUser.role }}</p>
              </div>

              <!-- Menu dropdown -->
              <div class="relative group">
                <button class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                  <span class="text-gray-600">▼</span>
                </button>

                <!-- Dropdown menu -->
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <NuxtLink
                      to="/profile"
                      class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    Mon profil
                  </NuxtLink>


                  <hr class="my-1 border-gray-200">

                  <button
                      @click="handleLogout"
                      class="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- Si non connecté -->
          <template v-else>
            <NuxtLink
                to="/login"
                class="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition"
            >
              Connexion
            </NuxtLink>

            <NuxtLink
                to="/register"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
            >
              Inscription
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Animation du dropdown */
.group:hover .group-hover\:opacity-100 {
  transition-delay: 0.1s;
}
</style>