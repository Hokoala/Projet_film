<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSession } from '~/stores/session.js'

// Utiliser directement le store au lieu de useAuth()
const session = useSession()

// État du menu mobile
const mobileMenuOpen = ref(false)

// Computed properties réactifs
const isAuthenticated = computed(() => session.loggedIn)
const currentUser = computed(() => session.user)

// Image de profil avec fallback sur avatar par défaut
const profileImage = computed(() => {
  if (session.user?.profileImage) {
    return session.user.profileImage
  }
  if (session.user?.avatar) {
    return session.user.avatar
  }
  return '/default-avatar.png'
})

const handleLogout = async () => {
  session.logout()
  mobileMenuOpen.value = false
  await navigateTo('/')
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav class="bg-gradient-to-r from-black via-gray-900 to-red-950 shadow-lg border-b border-red-900/30">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Menu principal -->
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 transition">
             UTOPIA
          </NuxtLink>

          <!-- Menu Desktop (caché sur mobile) -->
          <div class="hidden md:flex items-center gap-4">
            <NuxtLink
                to="/"
                class="text-gray-300 hover:text-red-400 font-medium transition"
            >
              Accueil
            </NuxtLink>

            <NuxtLink
                to="/movies"
                class="text-gray-300 hover:text-red-400 font-medium transition"
            >
              Films
            </NuxtLink>

            <NuxtLink
                to="/directors"
                class="text-gray-300 hover:text-red-400 font-medium transition"
            >
              Réalisateurs
            </NuxtLink>

            <NuxtLink
                to="/actors"
                class="text-gray-300 hover:text-red-400 font-medium transition"
            >
              Acteurs
            </NuxtLink>

            <NuxtLink
                v-if="isAuthenticated && currentUser?.role === 'admin'"
                to="/admin"
                class="text-gray-300 hover:text-red-400 font-medium transition"
            >
              Administration
            </NuxtLink>
          </div>
        </div>

        <!-- Section utilisateur Desktop (caché sur mobile) -->
        <div class="hidden md:flex items-center gap-4">
          <!-- Si connecté -->
          <template v-if="isAuthenticated && currentUser">
            <div class="flex items-center gap-3">
              <!-- Avatar avec image de profil uploadée -->
              <NuxtLink to="/profile" class="flex-shrink-0">
                <img
                    :src="profileImage"
                    :alt="currentUser.name"
                    class="w-10 h-10 rounded-full border-2 border-red-600 object-cover hover:border-red-400 transition cursor-pointer shadow-lg"
                />
              </NuxtLink>

              <!-- Info utilisateur -->
              <div>
                <p class="text-sm font-semibold text-white">{{ currentUser.name }}</p>
                <p class="text-xs text-red-400 capitalize">{{ currentUser.role }}</p>
              </div>

              <!-- Menu dropdown -->
              <div class="relative group">
                <button class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-900/30 transition text-gray-300">
                  <span>▼</span>
                </button>

                <!-- Dropdown menu -->
                <div class="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-red-900/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <NuxtLink
                      to="/profile"
                      class="block px-4 py-3 text-sm text-gray-300 hover:bg-red-900/30 hover:text-red-400 transition rounded-t-lg"
                  >
                    Mon profil
                  </NuxtLink>

                  <hr class="my-1 border-red-900/50">

                  <button
                      @click="handleLogout"
                      class="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-900/30 transition rounded-b-lg"
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
                class="px-4 py-2 text-gray-300 font-medium hover:text-red-400 transition"
            >
              Connexion
            </NuxtLink>

            <NuxtLink
                to="/register"
                class="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition shadow-lg"
            >
              Inscription
            </NuxtLink>
          </template>
        </div>

        <!-- Bouton hamburger (visible sur mobile uniquement) -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-red-900/30 transition"
          aria-label="Menu"
        >
          <span
            class="block w-6 h-0.5 bg-red-500 transition-all"
            :class="{ 'rotate-45 translate-y-2': mobileMenuOpen }"
          ></span>
          <span
            class="block w-6 h-0.5 bg-red-500 transition-all"
            :class="{ 'opacity-0': mobileMenuOpen }"
          ></span>
          <span
            class="block w-6 h-0.5 bg-red-500 transition-all"
            :class="{ '-rotate-45 -translate-y-2': mobileMenuOpen }"
          ></span>
        </button>
      </div>
    </div>

    <!-- Menu Mobile -->
    <Transition name="slide">
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-black/95 backdrop-blur-md border-t border-red-900/30"
      >
        <div class="container mx-auto px-4 py-4 space-y-2">
          <!-- Avatar et info utilisateur si connecté -->
          <div v-if="isAuthenticated && currentUser" class="flex items-center gap-3 pb-4 border-b border-red-900/30">
            <img
                :src="profileImage"
                :alt="currentUser.name"
                class="w-12 h-12 rounded-full border-2 border-red-600 object-cover"
            />
            <div>
              <p class="text-white font-semibold">{{ currentUser.name }}</p>
              <p class="text-xs text-red-400 capitalize">{{ currentUser.role }}</p>
            </div>
          </div>

          <!-- Liens de navigation -->
          <NuxtLink
              to="/"
              @click="closeMobileMenu"
              class="block py-3 px-4 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
          >
             Accueil
          </NuxtLink>

          <NuxtLink
              to="/movies"
              @click="closeMobileMenu"
              class="block py-3 px-4 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
          >
             Films
          </NuxtLink>

          <NuxtLink
              to="/directors"
              @click="closeMobileMenu"
              class="block py-3 px-4 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
          >
             Réalisateurs
          </NuxtLink>

          <NuxtLink
              to="/actors"
              @click="closeMobileMenu"
              class="block py-3 px-4 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
          >
             Acteurs
          </NuxtLink>

          <NuxtLink
              v-if="isAuthenticated && currentUser?.role === 'admin'"
              to="/admin"
              @click="closeMobileMenu"
              class="block py-3 px-4 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
          >
            Administration
          </NuxtLink>

          <!-- Actions utilisateur -->
          <div v-if="isAuthenticated && currentUser" class="pt-2 border-t border-red-900/30 space-y-2">
            <NuxtLink
                to="/profile"
                @click="closeMobileMenu"
                class="block py-3 px-4 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
            >
               Mon Profil
            </NuxtLink>

            <button
                @click="handleLogout"
                class="w-full text-left py-3 px-4 text-red-400 hover:bg-red-900/20 rounded-lg transition font-medium"
            >
              Déconnexion
            </button>
          </div>

          <!-- Boutons connexion/inscription si non connecté -->
          <div v-else class="pt-2 space-y-2">
            <NuxtLink
                to="/login"
                @click="closeMobileMenu"
                class="block py-3 px-4 text-center text-gray-300 hover:text-red-400 border border-red-600 rounded-lg transition"
            >
              Connexion
            </NuxtLink>

            <NuxtLink
                to="/register"
                @click="closeMobileMenu"
                class="block py-3 px-4 text-center bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition shadow-lg"
            >
              Inscription
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
/* Animation du dropdown */
.group:hover .group-hover\:opacity-100 {
  transition-delay: 0.1s;
}

/* Animation du menu mobile */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Animation des barres du hamburger */
button span {
  transform-origin: center;
}
</style>