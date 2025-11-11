import { auth } from '~/services/auth.js'


export default {
  register (credentials) {
    return auth('/register', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  },

  login (credentials) {
    return auth('/auth', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  },

  user () {
    return auth('/me')
  },

  logout () {
    return auth('/logout', {
      method: 'POST'
    })
  }
}
