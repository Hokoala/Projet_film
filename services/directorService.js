import { api } from "~/services/api.js";

export default {
    async getAllDirectors() {
        return api('/directors', {
            method: 'GET',
        })
    },

    async getDirectorById(id) {
        return api(`/directors/${id}`, {
            method: 'GET',
        })
    },

    async createDirector(directorData) {
        return api('/directors', {
            method: 'POST',
            body: JSON.stringify(directorData)
        })
    },

    async updateDirector(id, directorData) {
        return api(`/directors/${id}`, {
            method: 'PUT',
            body: JSON.stringify(directorData)
        })
    },

    async deleteDirector(id) {
        return api(`/directors/${id}`, {
            method: 'DELETE',
        })
    }
}
