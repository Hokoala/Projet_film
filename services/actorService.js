import { api } from "~/services/api.js";

export default {
    async getAllActors() {
        return api('/actors', {
            method: 'GET',
        })
    },

    async getActorById(id) {
        return api(`/actors/${id}`, {
            method: 'GET',
        })
    },

    async createActor(actorData) {
        return api('/actors', {
            method: 'POST',
            body: JSON.stringify(actorData)
        })
    },

    async updateActor(id, actorData) {
        return api(`/actors/${id}`, {
            method: 'PUT',
            body: JSON.stringify(actorData)
        })
    },

    async deleteActor(id) {
        return api(`/actors/${id}`, {
            method: 'DELETE',
        })
    }
}
