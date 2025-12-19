<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Administration</h1>
        <p class="text-gray-400">Gestion des films, acteurs et realisateurs</p>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-red-900/30 to-gray-900 border border-red-900/50 rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
              </svg>
            </div>
            <div>
              <p class="text-3xl font-bold text-white">{{ stats.films }}</p>
              <p class="text-gray-400 text-sm">Films</p>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-blue-900/30 to-gray-900 border border-blue-900/50 rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <p class="text-3xl font-bold text-white">{{ stats.directors }}</p>
              <p class="text-gray-400 text-sm">Realisateurs</p>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-900/30 to-gray-900 border border-green-900/50 rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
              </svg>
            </div>
            <div>
              <p class="text-3xl font-bold text-white">{{ stats.actors }}</p>
              <p class="text-gray-400 text-sm">Acteurs</p>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-900/30 to-gray-900 border border-purple-900/50 rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
            <div>
              <p class="text-3xl font-bold text-white">{{ stats.users }}</p>
              <p class="text-gray-400 text-sm">Utilisateurs</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="flex gap-2 border-b border-gray-700">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-6 py-3 font-semibold transition-all"
            :class="activeTab === tab.id
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-gray-400 hover:text-white'"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- Contenu des tabs -->
      <div class="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        <!-- Films -->
        <div v-if="activeTab === 'films'">
          <div class="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 class="text-xl font-bold text-white">Gestion des Films</h2>
            <button
              @click="openFilmModal()"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Ajouter un film
            </button>
          </div>

          <div v-if="loading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-red-600 mx-auto"></div>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-900/50">
                <tr>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">ID</th>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">Titre</th>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">Realisateur</th>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">Date</th>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">Duree</th>
                  <th class="px-4 py-3 text-right text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <tr v-for="film in films" :key="film.id" class="hover:bg-gray-700/30">
                  <td class="px-4 py-3 text-gray-300">{{ film.id }}</td>
                  <td class="px-4 py-3 text-white font-medium">{{ film.name }}</td>
                  <td class="px-4 py-3 text-gray-300">
                    {{ film.director?.firstname }} {{ film.director?.lastname }}
                  </td>
                  <td class="px-4 py-3 text-gray-300">{{ formatDate(film.releaseDate) }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ film.duration }} min</td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex justify-end gap-2">
                      <NuxtLink
                        :to="`/movie/${film.id}`"
                        class="p-2 text-gray-400 hover:text-white transition"
                        title="Voir"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </NuxtLink>
                      <button
                        @click="openFilmModal(film)"
                        class="p-2 text-blue-400 hover:text-blue-300 transition"
                        title="Modifier"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        @click="deleteFilm(film.id)"
                        class="p-2 text-red-400 hover:text-red-300 transition"
                        title="Supprimer"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Realisateurs -->
        <div v-if="activeTab === 'directors'">
          <div class="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 class="text-xl font-bold text-white">Gestion des Realisateurs</h2>
            <button
              @click="openDirectorModal()"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Ajouter un realisateur
            </button>
          </div>

          <div v-if="loading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-red-600 mx-auto"></div>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-900/50">
                <tr>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">ID</th>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">Prenom</th>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">Nom</th>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">Nationalite</th>
                  <th class="px-4 py-3 text-right text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <tr v-for="director in directors" :key="director.id" class="hover:bg-gray-700/30">
                  <td class="px-4 py-3 text-gray-300">{{ director.id }}</td>
                  <td class="px-4 py-3 text-white font-medium">{{ director.firstname }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ director.lastname }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ director.nationality || '-' }}</td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex justify-end gap-2">
                      <NuxtLink
                        :to="`/director/${director.id}`"
                        class="p-2 text-gray-400 hover:text-white transition"
                        title="Voir"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </NuxtLink>
                      <button
                        @click="openDirectorModal(director)"
                        class="p-2 text-blue-400 hover:text-blue-300 transition"
                        title="Modifier"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        @click="deleteDirector(director.id)"
                        class="p-2 text-red-400 hover:text-red-300 transition"
                        title="Supprimer"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Acteurs -->
        <div v-if="activeTab === 'actors'">
          <div class="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 class="text-xl font-bold text-white">Gestion des Acteurs</h2>
            <button
              @click="openActorModal()"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Ajouter un acteur
            </button>
          </div>

          <div v-if="loading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-red-600 mx-auto"></div>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-900/50">
                <tr>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">ID</th>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">Prenom</th>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">Nom</th>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">Nationalite</th>
                  <th class="px-4 py-3 text-right text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <tr v-for="actor in actors" :key="actor.id" class="hover:bg-gray-700/30">
                  <td class="px-4 py-3 text-gray-300">{{ actor.id }}</td>
                  <td class="px-4 py-3 text-white font-medium">{{ actor.firstname }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ actor.lastname }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ actor.nationality || '-' }}</td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex justify-end gap-2">
                      <NuxtLink
                        :to="`/actor/${actor.id}`"
                        class="p-2 text-gray-400 hover:text-white transition"
                        title="Voir"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </NuxtLink>
                      <button
                        @click="openActorModal(actor)"
                        class="p-2 text-blue-400 hover:text-blue-300 transition"
                        title="Modifier"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        @click="deleteActor(actor.id)"
                        class="p-2 text-red-400 hover:text-red-300 transition"
                        title="Supprimer"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Utilisateurs -->
        <div v-if="activeTab === 'users'">
          <div class="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 class="text-xl font-bold text-white">Gestion des Utilisateurs</h2>
            <button
              @click="openUserModal()"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Ajouter un utilisateur
            </button>
          </div>

          <div v-if="loading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-red-600 mx-auto"></div>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-900/50">
                <tr>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">ID</th>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">Email</th>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">Prenom</th>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">Nom</th>
                  <th class="px-4 py-3 text-left text-gray-400 font-medium">Roles</th>
                  <th class="px-4 py-3 text-right text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-700/30">
                  <td class="px-4 py-3 text-gray-300">{{ user.id }}</td>
                  <td class="px-4 py-3 text-white font-medium">{{ user.email }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ user.firstname || '-' }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ user.lastname || '-' }}</td>
                  <td class="px-4 py-3">
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="role in user.roles"
                        :key="role"
                        class="px-2 py-0.5 text-xs rounded border"
                        :class="getRoleBadgeColor(role)"
                      >
                        {{ getRoleLabel(role) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        @click="openUserModal(user)"
                        class="p-2 text-blue-400 hover:text-blue-300 transition"
                        title="Modifier"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        @click="deleteUser(user.id)"
                        class="p-2 text-red-400 hover:text-red-300 transition"
                        title="Supprimer"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Film (Ajouter/Modifier) -->
      <div v-if="showFilmModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div class="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-2xl my-8">
          <div class="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 class="text-xl font-bold text-white">
              {{ editingFilmId ? 'Modifier le film' : 'Ajouter un film' }}
            </h3>
            <button @click="closeFilmModal" class="text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <form @submit.prevent="saveFilm" class="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label class="block text-gray-300 text-sm mb-1">Titre *</label>
              <input v-model="filmForm.name" type="text" required
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
            </div>
            <div>
              <label class="block text-gray-300 text-sm mb-1">Description *</label>
              <textarea v-model="filmForm.description" rows="3" required
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 text-sm mb-1">Realisateur *</label>
                <select v-model="filmForm.directorId" required
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none">
                  <option value="" disabled>Selectionner</option>
                  <option v-for="director in directors" :key="director.id" :value="director.id">
                    {{ director.firstname }} {{ director.lastname }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-gray-300 text-sm mb-1">Date de sortie</label>
                <input v-model="filmForm.releaseDate" type="date"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 text-sm mb-1">Duree (minutes)</label>
                <input v-model.number="filmForm.duration" type="number" min="1"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
              </div>
              <div>
                <label class="block text-gray-300 text-sm mb-1">Budget</label>
                <input v-model.number="filmForm.budget" type="number" min="0"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 text-sm mb-1">Nombre d'entrees</label>
                <input v-model.number="filmForm.nbEntries" type="number" min="0"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
              </div>
              <div>
                <label class="block text-gray-300 text-sm mb-1">URL site officiel</label>
                <input v-model="filmForm.url" type="url"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
              </div>
            </div>
            <div class="flex gap-3 pt-4">
              <button type="button" @click="closeFilmModal"
                class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                Annuler
              </button>
              <button type="submit" :disabled="savingFilm"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50">
                {{ savingFilm ? 'Enregistrement...' : (editingFilmId ? 'Modifier' : 'Ajouter') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Realisateur (Ajouter/Modifier) -->
      <div v-if="showDirectorModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div class="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
          <div class="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 class="text-xl font-bold text-white">
              {{ editingDirectorId ? 'Modifier le realisateur' : 'Ajouter un realisateur' }}
            </h3>
            <button @click="closeDirectorModal" class="text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <form @submit.prevent="saveDirector" class="p-4 space-y-4">
            <div>
              <label class="block text-gray-300 text-sm mb-1">Prenom *</label>
              <input v-model="directorForm.firstname" type="text" required
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
            </div>
            <div>
              <label class="block text-gray-300 text-sm mb-1">Nom *</label>
              <input v-model="directorForm.lastname" type="text" required
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
            </div>
            <div>
              <label class="block text-gray-300 text-sm mb-1">Nationalite</label>
              <input v-model="directorForm.nationality" type="text"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
            </div>
            <div class="flex gap-3 pt-4">
              <button type="button" @click="closeDirectorModal"
                class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                Annuler
              </button>
              <button type="submit" :disabled="savingDirector"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50">
                {{ savingDirector ? 'Enregistrement...' : (editingDirectorId ? 'Modifier' : 'Ajouter') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Acteur (Ajouter/Modifier) -->
      <div v-if="showActorModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div class="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
          <div class="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 class="text-xl font-bold text-white">
              {{ editingActorId ? 'Modifier l\'acteur' : 'Ajouter un acteur' }}
            </h3>
            <button @click="closeActorModal" class="text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <form @submit.prevent="saveActor" class="p-4 space-y-4">
            <div>
              <label class="block text-gray-300 text-sm mb-1">Prenom *</label>
              <input v-model="actorForm.firstname" type="text" required
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
            </div>
            <div>
              <label class="block text-gray-300 text-sm mb-1">Nom *</label>
              <input v-model="actorForm.lastname" type="text" required
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
            </div>
            <div>
              <label class="block text-gray-300 text-sm mb-1">Nationalite</label>
              <input v-model="actorForm.nationality" type="text"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
            </div>
            <div class="flex gap-3 pt-4">
              <button type="button" @click="closeActorModal"
                class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                Annuler
              </button>
              <button type="submit" :disabled="savingActor"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50">
                {{ savingActor ? 'Enregistrement...' : (editingActorId ? 'Modifier' : 'Ajouter') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Utilisateur (Ajouter/Modifier) -->
      <div v-if="showUserModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div class="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
          <div class="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 class="text-xl font-bold text-white">
              {{ editingUserId ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur' }}
            </h3>
            <button @click="closeUserModal" class="text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <form @submit.prevent="saveUser" class="p-4 space-y-4">
            <div>
              <label class="block text-gray-300 text-sm mb-1">Email *</label>
              <input v-model="userForm.email" type="email" required
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
            </div>
            <div>
              <label class="block text-gray-300 text-sm mb-1">
                Mot de passe {{ editingUserId ? '(laisser vide pour ne pas changer)' : '*' }}
              </label>
              <input v-model="userForm.password" type="password" :required="!editingUserId"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-300 text-sm mb-1">Prenom</label>
                <input v-model="userForm.firstname" type="text"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
              </div>
              <div>
                <label class="block text-gray-300 text-sm mb-1">Nom</label>
                <input v-model="userForm.lastname" type="text"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"/>
              </div>
            </div>
            <div>
              <label class="block text-gray-300 text-sm mb-2">Roles *</label>
              <div class="space-y-2">
                <label v-for="role in availableRoles" :key="role.value" class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :value="role.value"
                    v-model="userForm.roles"
                    class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-500"
                  />
                  <span class="text-gray-300">{{ role.label }}</span>
                </label>
              </div>
            </div>
            <div class="flex gap-3 pt-4">
              <button type="button" @click="closeUserModal"
                class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                Annuler
              </button>
              <button type="submit" :disabled="savingUser"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50">
                {{ savingUser ? 'Enregistrement...' : (editingUserId ? 'Modifier' : 'Ajouter') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '~/stores/session'
import filmService from '~/services/filmService'
import directorService from '~/services/directorService'
import actorService from '~/services/actorService'
import userService from '~/services/userService'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const session = useSession()

const loading = ref(true)
const activeTab = ref('films')

const films = ref([])
const directors = ref([])
const actors = ref([])
const users = ref([])

const stats = ref({
  films: 0,
  directors: 0,
  actors: 0,
  users: 0
})

const tabs = [
  { id: 'films', name: 'Films' },
  { id: 'directors', name: 'Realisateurs' },
  { id: 'actors', name: 'Acteurs' },
  { id: 'users', name: 'Utilisateurs' }
]

// Modals Films
const showFilmModal = ref(false)
const savingFilm = ref(false)
const editingFilmId = ref(null)
const filmForm = ref({
  name: '',
  description: '',
  directorId: '',
  releaseDate: '',
  duration: null,
  budget: null,
  nbEntries: 0,
  url: ''
})

// Modals Realisateurs
const showDirectorModal = ref(false)
const savingDirector = ref(false)
const editingDirectorId = ref(null)
const directorForm = ref({
  firstname: '',
  lastname: '',
  nationality: ''
})

// Modals Acteurs
const showActorModal = ref(false)
const savingActor = ref(false)
const editingActorId = ref(null)
const actorForm = ref({
  firstname: '',
  lastname: '',
  nationality: ''
})

// Modals Utilisateurs
const showUserModal = ref(false)
const savingUser = ref(false)
const editingUserId = ref(null)
const userForm = ref({
  email: '',
  password: '',
  firstname: '',
  lastname: '',
  roles: ['ROLE_USER']
})

const availableRoles = [
  { value: 'ROLE_USER', label: 'Utilisateur' },
  { value: 'ROLE_ADMIN', label: 'Administrateur' },
  { value: 'ROLE_EDITOR', label: 'Editeur' },
  { value: 'ROLE_AUTHOR', label: 'Auteur' }
]

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

// Charger les donnees
const loadData = async () => {
  loading.value = true
  try {
    // Charger les films
    const filmsResponse = await filmService.getAllFilms()
    films.value = filmsResponse['hydra:member'] || filmsResponse.member || filmsResponse || []
    stats.value.films = films.value.length

    // Charger les realisateurs
    const directorsResponse = await directorService.getAllDirectors()
    directors.value = directorsResponse['hydra:member'] || directorsResponse.member || directorsResponse || []
    stats.value.directors = directors.value.length

    // Charger les acteurs
    const actorsResponse = await actorService.getAllActors()
    actors.value = actorsResponse['hydra:member'] || actorsResponse.member || actorsResponse || []
    stats.value.actors = actors.value.length

    // Charger les utilisateurs
    try {
      const usersResponse = await userService.getAllUsers()
      users.value = usersResponse['hydra:member'] || usersResponse.member || usersResponse || []
      stats.value.users = users.value.length
    } catch (userError) {
      // console.warn('Impossible de charger les utilisateurs:', userError.message)
      users.value = []
      stats.value.users = 0
    }

  } catch (error) {
    // console.error('Erreur chargement donnees:', error)
  } finally {
    loading.value = false
  }
}

// ==================== FILMS ====================

const openFilmModal = (film = null) => {
  if (film) {
    editingFilmId.value = film.id
    filmForm.value = {
      name: film.name || '',
      description: film.description || '',
      directorId: film.director?.id || '',
      releaseDate: film.releaseDate ? film.releaseDate.split('T')[0] : '',
      duration: film.duration || null,
      budget: film.budget || null,
      nbEntries: film.nbEntries || 0,
      url: film.url || ''
    }
  } else {
    editingFilmId.value = null
    filmForm.value = {
      name: '',
      description: '',
      directorId: '',
      releaseDate: '',
      duration: null,
      budget: null,
      nbEntries: 0,
      url: ''
    }
  }
  showFilmModal.value = true
}

const closeFilmModal = () => {
  showFilmModal.value = false
  editingFilmId.value = null
}

const saveFilm = async () => {
  savingFilm.value = true
  try {
    const filmData = {
      name: filmForm.value.name,
      description: filmForm.value.description
    }

    // Ajouter duration seulement si rempli
    if (filmForm.value.duration) {
      filmData.duration = parseInt(filmForm.value.duration)
    }

    // Ajouter releaseDate seulement si rempli (format ISO)
    if (filmForm.value.releaseDate) {
      filmData.releaseDate = filmForm.value.releaseDate
    }

    // Ajouter nbEntries seulement si rempli
    if (filmForm.value.nbEntries) {
      filmData.nbEntries = parseInt(filmForm.value.nbEntries)
    }

    // Ajouter url seulement si rempli
    if (filmForm.value.url) {
      filmData.url = filmForm.value.url
    }

    // Ajouter budget seulement si rempli
    if (filmForm.value.budget) {
      filmData.budget = parseFloat(filmForm.value.budget)
    }

    // Ajouter director (IRI format pour API Platform)
    if (filmForm.value.directorId) {
      filmData.director = `/api/directors/${filmForm.value.directorId}`
    }

    // console.log('Donnees envoyees:', JSON.stringify(filmData, null, 2))

    if (editingFilmId.value) {
      // Modification
      await filmService.updateFilm(editingFilmId.value, filmData)
      const index = films.value.findIndex(f => f.id === editingFilmId.value)
      if (index !== -1) {
        const updatedFilm = await filmService.getFilmById(editingFilmId.value)
        films.value[index] = updatedFilm
      }
      alert('Film modifie avec succes')
    } else {
      // Creation
      const newFilm = await filmService.createFilm(filmData)
      films.value.push(newFilm)
      stats.value.films = films.value.length
      alert('Film ajoute avec succes')
    }
    closeFilmModal()
  } catch (error) {
    // console.error('Erreur:', error)
    alert('Erreur: ' + error.message)
  } finally {
    savingFilm.value = false
  }
}

const deleteFilm = async (id) => {
  if (!confirm('Supprimer ce film ?')) return

  try {
    await filmService.deleteFilm(id)
    films.value = films.value.filter(f => f.id !== id)
    stats.value.films = films.value.length
    alert('Film supprime')
  } catch (error) {
    // console.error('Erreur suppression:', error)
    alert('Erreur lors de la suppression')
  }
}

// ==================== REALISATEURS ====================

const openDirectorModal = (director = null) => {
  if (director) {
    editingDirectorId.value = director.id
    directorForm.value = {
      firstname: director.firstname || '',
      lastname: director.lastname || '',
      nationality: director.nationality || ''
    }
  } else {
    editingDirectorId.value = null
    directorForm.value = {
      firstname: '',
      lastname: '',
      nationality: ''
    }
  }
  showDirectorModal.value = true
}

const closeDirectorModal = () => {
  showDirectorModal.value = false
  editingDirectorId.value = null
}

const saveDirector = async () => {
  savingDirector.value = true
  try {
    if (editingDirectorId.value) {
      // Modification
      await directorService.updateDirector(editingDirectorId.value, directorForm.value)
      const index = directors.value.findIndex(d => d.id === editingDirectorId.value)
      if (index !== -1) {
        directors.value[index] = { ...directors.value[index], ...directorForm.value }
      }
      alert('Realisateur modifie avec succes')
    } else {
      // Creation
      const newDirector = await directorService.createDirector(directorForm.value)
      directors.value.push(newDirector)
      stats.value.directors = directors.value.length
      alert('Realisateur ajoute avec succes')
    }
    closeDirectorModal()
  } catch (error) {
    // console.error('Erreur:', error)
    alert('Erreur lors de l\'enregistrement')
  } finally {
    savingDirector.value = false
  }
}

const deleteDirector = async (id) => {
  if (!confirm('Supprimer ce realisateur ?')) return

  try {
    await directorService.deleteDirector(id)
    directors.value = directors.value.filter(d => d.id !== id)
    stats.value.directors = directors.value.length
    alert('Realisateur supprime')
  } catch (error) {
    // console.error('Erreur suppression:', error)
    alert('Erreur lors de la suppression')
  }
}

// ==================== ACTEURS ====================

const openActorModal = (actor = null) => {
  if (actor) {
    editingActorId.value = actor.id
    actorForm.value = {
      firstname: actor.firstname || '',
      lastname: actor.lastname || '',
      nationality: actor.nationality || ''
    }
  } else {
    editingActorId.value = null
    actorForm.value = {
      firstname: '',
      lastname: '',
      nationality: ''
    }
  }
  showActorModal.value = true
}

const closeActorModal = () => {
  showActorModal.value = false
  editingActorId.value = null
}

const saveActor = async () => {
  savingActor.value = true
  try {
    if (editingActorId.value) {
      // Modification
      await actorService.updateActor(editingActorId.value, actorForm.value)
      const index = actors.value.findIndex(a => a.id === editingActorId.value)
      if (index !== -1) {
        actors.value[index] = { ...actors.value[index], ...actorForm.value }
      }
      alert('Acteur modifie avec succes')
    } else {
      // Creation
      const newActor = await actorService.createActor(actorForm.value)
      actors.value.push(newActor)
      stats.value.actors = actors.value.length
      alert('Acteur ajoute avec succes')
    }
    closeActorModal()
  } catch (error) {
    // console.error('Erreur:', error)
    alert('Erreur lors de l\'enregistrement')
  } finally {
    savingActor.value = false
  }
}

const deleteActor = async (id) => {
  if (!confirm('Supprimer cet acteur ?')) return

  try {
    await actorService.deleteActor(id)
    actors.value = actors.value.filter(a => a.id !== id)
    stats.value.actors = actors.value.length
    alert('Acteur supprime')
  } catch (error) {
    // console.error('Erreur suppression:', error)
    alert('Erreur lors de la suppression')
  }
}

// ==================== UTILISATEURS ====================

const openUserModal = (user = null) => {
  if (user) {
    editingUserId.value = user.id
    userForm.value = {
      email: user.email || '',
      password: '',
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      roles: user.roles || ['ROLE_USER']
    }
  } else {
    editingUserId.value = null
    userForm.value = {
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      roles: ['ROLE_USER']
    }
  }
  showUserModal.value = true
}

const closeUserModal = () => {
  showUserModal.value = false
  editingUserId.value = null
}

const getRoleLabel = (role) => {
  const found = availableRoles.find(r => r.value === role)
  return found ? found.label : role
}

const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'ROLE_ADMIN': return 'bg-red-600/20 text-red-400 border-red-600/50'
    case 'ROLE_EDITOR': return 'bg-blue-600/20 text-blue-400 border-blue-600/50'
    case 'ROLE_AUTHOR': return 'bg-green-600/20 text-green-400 border-green-600/50'
    default: return 'bg-gray-600/20 text-gray-400 border-gray-600/50'
  }
}

const saveUser = async () => {
  savingUser.value = true
  try {
    const userData = {
      email: userForm.value.email,
      firstname: userForm.value.firstname,
      lastname: userForm.value.lastname,
      roles: userForm.value.roles
    }

    // Ajouter le mot de passe seulement si rempli
    if (userForm.value.password) {
      userData.password = userForm.value.password
    }

    if (editingUserId.value) {
      // Modification
      await userService.updateUser(editingUserId.value, userData)
      const index = users.value.findIndex(u => u.id === editingUserId.value)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...userData }
      }
      alert('Utilisateur modifie avec succes')
    } else {
      // Creation - mot de passe obligatoire
      if (!userForm.value.password) {
        alert('Le mot de passe est obligatoire pour un nouvel utilisateur')
        savingUser.value = false
        return
      }
      const newUser = await userService.createUser(userData)
      users.value.push(newUser)
      stats.value.users = users.value.length
      alert('Utilisateur ajoute avec succes')
    }
    closeUserModal()
  } catch (error) {
    // console.error('Erreur:', error)
    if (error.message === 'Failed to fetch') {
      alert('Erreur de connexion au serveur. Verifiez que le backend est demarre et que l\'endpoint /api/users existe.')
    } else {
      alert('Erreur lors de l\'enregistrement: ' + error.message)
    }
  } finally {
    savingUser.value = false
  }
}

const deleteUser = async (id) => {
  if (!confirm('Supprimer cet utilisateur ?')) return

  try {
    await userService.deleteUser(id)
    users.value = users.value.filter(u => u.id !== id)
    stats.value.users = users.value.length
    alert('Utilisateur supprime')
  } catch (error) {
    // console.error('Erreur suppression:', error)
    alert('Erreur lors de la suppression')
  }
}

onMounted(async () => {
  session.restoreSession()

  // Verifier si admin
  if (!session.isAdmin) {
    alert('Acces reserve aux administrateurs')
    router.push('/')
    return
  }

  await loadData()
})
</script>
