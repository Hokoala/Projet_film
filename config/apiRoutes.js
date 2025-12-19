// Configuration des routes API
// Modifiez ces routes selon votre backend Symfony

export const API_ROUTES = {
  // Routes d'authentification possibles (testées dans l'ordre)
  LOGIN: [
    '/login',
    '/login_check',
    '/auth/login',
    '/authentication_token',
    '/api/login',
    '/api/login_check',
    '/api/auth/login'
  ],

  REGISTER: '/register',
  USER: '/me',
  LOGOUT: '/logout',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Routes CRUD
  USERS: '/users'
}
