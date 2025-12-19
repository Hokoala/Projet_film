import { auth } from '~/services/auth.js'
import { api } from '~/services/api.js'

export default {
    register(credentials) {
        return auth('/register', {
            method: 'POST',
            body: JSON.stringify(credentials)
        })
    },

    /**
     * CONNEXION - Se connecter avec email/password
     */
    login(credentials) {
        return auth('/auth', {
            method: 'POST',
            body: JSON.stringify(credentials)
        })
    },

    /**
     * Récupérer les informations de l'utilisateur connecté
     */
    user() {
        return auth('/me')
    },

    /**
     * Déconnexion
     */
    logout() {
        return auth('/logout', {
            method: 'POST'
        })
    },

    // ==================== CRUD ADMIN ====================

    /**
     * Récupérer tous les utilisateurs (admin)
     */
    getAllUsers() {
        return api('/users?pagination=false')
    },

    /**
     * Récupérer un utilisateur par son ID
     */
    getUserById(id) {
        return api(`/users/${id}`)
    },

    /**
     * Créer un nouvel utilisateur (admin)
     */
    createUser(userData) {
        return api('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        })
    },

    /**
     * Mettre à jour un utilisateur (admin)
     */
    updateUser(id, userData) {
        return api(`/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/merge-patch+json'
            }
        })
    },

    /**
     * Supprimer un utilisateur (admin)
     */
    deleteUser(id) {
        return api(`/users/${id}`, {
            method: 'DELETE'
        })
    }
}