<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Restaurer la session au démarrage de l'app
import { useSession } from '~/stores/session.js'

const session = useSession()

// Restaurer la session si elle existe dans localStorage
onMounted(() => {
  session.restoreSession()
})
</script>

<style>
/* Style global pour le thème cinéma */
body {
  background: linear-gradient(to bottom right, #000000, #1f2937, #450a0a);
  min-height: 100vh;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #dc2626, #7f1d1d);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #ef4444, #991b1b);
}

/* Animation de chargement globale */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
