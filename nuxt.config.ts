// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  devtools: { enabled: true },
  app: {
    baseURL: '/',
  },
  runtimeConfig:{
    public:{
      apiUrl: process.env.API_URL || 'http://localhost:8319',
    }
  },

})