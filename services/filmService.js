import { api } from "~/services/api.js";

export default {
  async searchFilms(query) {
    return api(`/movies?name=${query}`, {
      method: 'GET',
    })
  },

  async getAllFilms() {
    return api('/movies', {
      method: 'GET',
    })
  },

  async getFilmById(id) {
    return api(`/movies/${id}`, {
      method: 'GET',
    })
  },

  async createFilm(filmData) {
    return api('/movies', {
      method: 'POST',
      body: JSON.stringify(filmData)
    })
  },

  async updateFilm(id, filmData) {
    return api(`/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(filmData)
    })
  },

  async deleteFilm(id) {
    return api(`/movies/${id}`, {
      method: 'DELETE',
    })
  }
}

