import userService from '~/services/userService.js'
import { useSession } from '~/stores/session.js'
import { useRuntimeConfig } from '#app'

export const useAuth = () => {
    const session = useSession()

    // Décoder le token JWT pour extraire les données (sans vérification de signature)
    const decodeJwt = (token) => {
        try {
            const base64Url = token.split('.')[1]
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            )
            return JSON.parse(jsonPayload)
        } catch (e) {
            // console.error('❌ Erreur décodage JWT:', e)
            return null
        }
    }

    // Extraire le rôle depuis un tableau de rôles Symfony
    const extractRoleFromArray = (roles) => {
        // console.log(' Roles trouvés:', roles)

        if (Array.isArray(roles) && roles.length > 0) {
            if (roles.includes('ROLE_ADMIN')) {
                // console.log(' ROLE_ADMIN détecté')
                return 'admin'
            }
            if (roles.includes('ROLE_USER')) {
                // console.log(' ROLE_USER détecté')
                return 'user'
            }
            const firstRole = roles[0].replace('ROLE_', '').toLowerCase()
            // console.log(' Premier rôle:', firstRole)
            return firstRole
        }

        return 'user'
    }

    // Extraire le rôle depuis le token JWT ou les données utilisateur
    const extractRole = (token, userData) => {
        // 1. Essayer de décoder le token JWT pour récupérer les rôles
        if (token) {
            const decoded = decodeJwt(token)
            // console.log(' Token JWT décodé:', decoded)

            if (decoded?.roles) {
                return extractRoleFromArray(decoded.roles)
            }
        }

        // 2. Fallback: chercher dans userData
        if (userData?.roles) {
            return extractRoleFromArray(userData.roles)
        }

        if (typeof userData?.role === 'string') {
            return userData.role
        }

        // console.log('️ Aucun rôle trouvé, défaut: user')
        return 'user'
    }

    // Fonction utilitaire pour extraire et sauvegarder le token
    const saveAuthData = (response, defaultName) => {
        const token = response.token || response.access_token || response.jwt
        if (!token) return null

        // console.log(' saveAuthData - token:', token)

        // Utiliser response.user s'il existe (données de /api/me)
        const userData = response.user || response
        // console.log(' userData:', userData)

        // Extraire le rôle depuis le token JWT (les rôles sont dedans!)
        const role = extractRole(token, userData)
        // console.log(' Rôle final extrait:', role)

        const user = {
            id: userData.id || 1,
            name: userData.firstname || userData.name || defaultName,
            email: userData.email || userData.username,
            role: role,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(defaultName)}&background=3b82f6&color=fff`
        }

        // console.log(' User créé:', user)

        session.login({ user, token })
        return user
    }

    // Connexion via userService
    const login = async (email, password) => {
        try {
            const response = await userService.login({ email, password })
            // console.log(' Réponse /auth:', response)

            const token = response.token || response.access_token || response.jwt
            if (!token) {
                return { success: false, error: 'Aucun token reçu de l\'API' }
            }

            // Récupérer les infos utilisateur via /api/me pour avoir les rôles
            let userData = response.user || response
            // console.log(' User data initiale:', userData)

            try {
                const runtimeConfig = useRuntimeConfig()
                const API_URL = runtimeConfig.public.apiUrl

                const meResponse = await fetch(`${API_URL}/api/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                })

                if (meResponse.ok) {
                    const meData = await meResponse.json()
                    // console.log(' Réponse /api/me:', meData)
                    userData = meData
                }
            } catch (meError) {
                // console.warn('️ Impossible de récupérer /api/me:', meError)
            }

            const user = saveAuthData({ ...response, user: userData, token }, email.split('@')[0])
            return user
                ? { success: true, user }
                : { success: false, error: 'Erreur lors de la création de l\'utilisateur' }

        } catch (error) {
            // console.error('Erreur de connexion API:', error)
            return { success: false, error: error.message || 'Erreur de connexion' }
        }
    }

    // Inscription via userService
    const register = async (name, email, password) => {
        try {
            const response = await userService.register({ name, email, password })

            const user = saveAuthData(response, name)
            return user
                ? { success: true, user }
                : { success: false, error: 'Aucun token reçu de l\'API' }

        } catch (error) {
            // console.error('Erreur d\'inscription API:', error)
            return { success: false, error: error.message || 'Erreur lors de l\'inscription' }
        }
    }

    // Déconnexion
    const logout = () => {
        session.logout()
    }

    // Mot de passe oublié
    const forgotPassword = async (email) => {
        try {
            const runtimeConfig = useRuntimeConfig()
            const API_URL = runtimeConfig.public.apiUrl

            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email })
            })

            const data = await response.json().catch(() => ({}))

            if (response.ok) {
                return { success: true, message: data.message || 'Un email de réinitialisation a été envoyé.' }
            } else {
                return { success: false, error: data.error || data.message || 'Erreur lors de l\'envoi de l\'email.' }
            }
        } catch (error) {
            // console.error('Erreur mot de passe oublié:', error)
            return { success: false, error: error.message || 'Erreur de connexion au serveur.' }
        }
    }

    // Helpers
    const hasRole = (role) => session.user?.role === role
    const canEdit = (authorId) => {
        if (!session.user) return false
        if (session.user.role === 'admin') return true
        return session.user.id === authorId
    }

    return {
        currentUser: session.user,
        isAuthenticated: session.loggedIn,
        login,
        register,
        logout,
        forgotPassword,
        hasRole,
        canEdit
    }
}