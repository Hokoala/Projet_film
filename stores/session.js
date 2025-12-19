// stores/session.js
import { defineStore } from 'pinia'

export const useSession = defineStore('session', {
    state: () => ({
        user: null,
        token: null,
        loggedIn: false
    }),

    getters: {
        // Vérifie si l'utilisateur est authentifié
        isAuthenticated: (state) => {
            return state.loggedIn && !!state.token && !!state.user
        },

        // Nom d'utilisateur
        userName: (state) => {
            return state.user?.name || state.user?.email?.split('@')[0] || 'Utilisateur'
        },

        // Rôle de l'utilisateur
        userRole: (state) => {
            return state.user?.role || 'user'
        },

        // Vérifications de rôle
        isAdmin: (state) => {
            return state.user?.role === 'admin' || state.user?.role === 'ROLE_ADMIN'
        },

        isUser: (state) => {
            return state.user?.role === 'user' || state.user?.role === 'ROLE_USER'
        },

        // Vérifie si l'utilisateur peut éditer une ressource (admin seulement)
        canEdit: (state) => {
            return () => {
                if (!state.loggedIn || !state.user) return false
                // Seul l'admin peut éditer
                return state.user.role === 'admin' || state.user.role === 'ROLE_ADMIN'
            }
        }
    },

    actions: {
        // Connexion
        login({ user, token }) {
            this.user = user
            this.token = token
            this.loggedIn = true

            // Sauvegarder dans localStorage
            if (process.client) {
                localStorage.setItem('user', JSON.stringify(user))
                localStorage.setItem('token', token)
                localStorage.setItem('loggedIn', 'true')
            }

            // console.log('✅ Session login:', { user, token, loggedIn: this.loggedIn })
        },

        // Déconnexion
        logout() {
            this.user = null
            this.token = null
            this.loggedIn = false

            // Nettoyer localStorage
            if (process.client) {
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                localStorage.removeItem('loggedIn')
            }

            // console.log(' Session logout')
        },

        // Mettre à jour les informations utilisateur
        updateUser(updates) {
            if (this.user) {
                this.user = { ...this.user, ...updates }

                // Sauvegarder dans localStorage
                if (process.client) {
                    localStorage.setItem('user', JSON.stringify(this.user))
                }

                // console.log('✏ User updated:', updates)
            }
        },

        // Restaurer la session depuis localStorage
        restoreSession() {
            if (process.client) {
                const savedUser = localStorage.getItem('user')
                const savedToken = localStorage.getItem('token')
                const savedLoggedIn = localStorage.getItem('loggedIn')

                if (savedUser && savedToken && savedLoggedIn === 'true') {
                    try {
                        this.user = JSON.parse(savedUser)
                        this.token = savedToken
                        this.loggedIn = true
                        // console.log('🔄 Session restored:', this.user)
                        return true
                    } catch (error) {
                        // console.error('❌ Erreur restauration session:', error)
                        this.logout()
                        return false
                    }
                } else {
                    // console.log('⚠️ Aucune session à restaurer')
                    this.loggedIn = false
                    return false
                }
            }
            return false
        }
    }
})