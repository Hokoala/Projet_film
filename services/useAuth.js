import userService from '~/services/userService.js'
import { useSession } from '~/stores/session.js'

export const useAuth = () => {
  const session = useSession()

  // Fonction utilitaire pour extraire et sauvegarder le token
  const saveAuthData = (response, defaultName) => {
    const token = response.token || response.access_token || response.jwt
    if (!token) return null

    const user = {
      id: response.user?.id || response.id || 1,
      name: response.user?.name || response.name || defaultName,
      email: response.user?.email || response.email,
      role: response.user?.role || response.role || 'author',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(defaultName)}&background=3b82f6&color=fff`
    }

    session.login({ user, token })
    return user
  }

  // Connexion via userService
  const login = async (email, password) => {
    try {
      const response = await userService.login({ email, password })

      const user = saveAuthData(response, email.split('@')[0])
      return user
        ? { success: true, user }
        : { success: false, error: 'Aucun token reçu de l\'API' }

    } catch (error) {
      console.error('Erreur de connexion API:', error)
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
      console.error('Erreur d\'inscription API:', error)
      return { success: false, error: error.message || 'Erreur lors de l\'inscription' }
    }
  }

  // Déconnexion
  const logout = () => {
    session.logout()
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
    hasRole,
    canEdit
  }
}
