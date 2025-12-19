<template>
  <footer class="bg-gradient-to-b from-gray-900 via-black to-red-950 text-gray-300 border-t border-red-900/30">
    <!-- Section principale -->
    <div class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">

        <!-- Colonne 1 : À propos -->
        <div>
          <h3 class="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
            🎬 UTOPIA
          </h3>
          <p class="text-sm text-gray-400 leading-relaxed">
            Votre plateforme cinéma de découverte de films.
            Explorez, recherchez et partagez vos films préférés.
          </p>
        </div>

        <!-- Colonne 2 : Navigation -->
        <div>
          <h3 class="text-white text-lg font-bold mb-4">Navigation</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/" class="text-sm hover:text-red-400 transition">
                Accueil
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/movies" class="text-sm hover:text-red-400 transition">
                Films
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/profile" class="text-sm hover:text-red-400 transition">
                Mon Profil
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Colonne 3 : Catégories -->
        <div>
          <h3 class="text-white text-lg font-bold mb-4">Catégories</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-sm hover:text-red-400 transition">Action</a>
            </li>
            <li>
              <a href="#" class="text-sm hover:text-red-400 transition">Comédie</a>
            </li>
            <li>
              <a href="#" class="text-sm hover:text-red-400 transition">Drame</a>
            </li>
            <li>
              <a href="#" class="text-sm hover:text-red-400 transition">Science-Fiction</a>
            </li>
            <li>
              <a href="#" class="text-sm hover:text-red-400 transition">Horreur</a>
            </li>
          </ul>
        </div>

        <!-- Colonne 4 : Contact & Légal -->
        <div>
          <h3 class="text-white text-lg font-bold mb-4">Informations</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-sm hover:text-red-400 transition">À propos</a>
            </li>
            <li>
              <a href="#" class="text-sm hover:text-red-400 transition">Contact</a>
            </li>
            <li>
              <a href="#" class="text-sm hover:text-red-400 transition">FAQ</a>
            </li>
            <li>
              <a href="#" class="text-sm hover:text-red-400 transition">Politique de confidentialité</a>
            </li>
            <li>
              <a href="#" class="text-sm hover:text-red-400 transition">Conditions d'utilisation</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Séparateur -->
      <div class="border-t border-red-900/30 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <!-- Copyright -->
          <p class="text-sm text-gray-500">
            &copy; {{ currentYear }} Utopia Cinema. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>

    <!-- Barre extra -->
    <div class="bg-black/50 py-4 border-t border-red-900/20">
      <div class="container mx-auto px-6">
        <p class="text-center text-xs text-gray-600">
           Application de gestion de films - Projet mmi23e10- Utopia Cinema
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
/* Animations au survol */
footer a {
  position: relative;
}

footer a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease;
}

footer a:hover::after {
  width: 100%;
}
</style>