<script setup lang="ts">
import { useAuth } from '~/services/useAuth.js'

const { currentUser, isAuthenticated, logout } = useAuth()

const handleLogout = async () => {
  logout()
  await navigateTo('/')
}
</script>

<template>
  <nav class="bg-white shadow-md border-b">
    <div class="container mx-auto px-4">




      <div class="flex items-center justify-between h-16">
        <!-- Menu principal -->
        <div class="flex items-center gap-2">
          <NuxtLink to="/" class="text-gray-600 hover:text-gray-900 font-medium">
            Home
          </NuxtLink>
          <NuxtLink to="/movies" class="text-gray-600 hover:text-gray-900 font-medium">
            Movies
          </NuxtLink>

          <NuxtLink v-if="isAuthenticated && currentUser?.role === 'admin'" to="/profile" class="text-gray-600 hover:text-gray-900 font-medium">
            Administration
          </NuxtLink>
        </div>

        <!-- Utilisateur connecté ou boutons connexion -->
        <div class="flex items-center gap-4">
          <template v-if="isAuthenticated && currentUser">
            <div class="flex items-center gap-3">
              <img
                :src="currentUser.avatar"
                :alt="currentUser.name"
                class="w-8 h-8 rounded-full"
              />
              <div class="hidden md:block">
                <p class="text-sm font-medium text-gray-900">{{ currentUser.name }}</p>
                <p class="text-xs text-gray-500 capitalize">{{ currentUser.role }}</p>
              </div>
              <UButton @click="handleLogout" color="gray" variant="ghost" size="sm">
                Déconnexion
              </UButton>
            </div>
          </template>

          <template v-else>
            <NuxtLink to="/login">
              <UButton color="gray" variant="ghost">
                Connexion
              </UButton>
            </NuxtLink>
            <NuxtLink to="/register">
              <UButton color="primary">
                Inscription
              </UButton>
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>
