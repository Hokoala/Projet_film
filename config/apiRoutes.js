// Configuration des routes API
// Modifiez ces routes selon votre backend Symfony

export const API_ROUTES = {
  // Routes d'authentification possibles (testées dans l'ordre)
  LOGIN: [
    '/login',           // Sans préfixe /api
    '/login_check',
    '/auth/login',
    '/authentication_token',
    '/api/login',
    '/api/login_check',
    '/api/auth/login'
  ],

  REGISTER: '/register',
  USER: '/me',
  LOGOUT: '/logout'
}

export const API_CONFIG = {
  // Si true, utilise un système d'authentification simulé
  USE_MOCK_AUTH: false,

  // Données de test pour l'authentification simulée
  MOCK_USERS: [
    {
      email: 'jeanmichel.le@univ-reims.fr',
      password: '123',
      token: 'mock-jwt-token-123456',
      user: {
        id: 1,
        name: 'Jean-Michel Le',
        email: 'jeanmichel.le@univ-reims.fr',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Jean-Michel+Le&background=3b82f6&color=fff'
      }
    },
    {
      email: 'test@test.com',
      password: 'test',
      token: 'mock-jwt-token-789012',
      user: {
        id: 2,
        name: 'Test User',
        email: 'test@test.com',
        role: 'author',
        avatar: 'https://ui-avatars.com/api/?name=Test+User&background=3b82f6&color=fff'
      }
    }
