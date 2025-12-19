import { api } from "~/services/api.js";

export default {
    // Récupérer tous les commentaires d'un film
    async getMovieComments(movieId) {
        return api(`/comments?movie.id=${movieId}&order[createdAt]=desc`, {
            method: 'GET',
        })
    },

    // Créer un nouveau commentaire
    async createComment(commentData) {
        return api('/comments', {
            method: 'POST',
            body: JSON.stringify(commentData)
        })
    },

    // Mettre à jour un commentaire
    async updateComment(id, commentData) {
        return api(`/comments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(commentData)
        })
    },

    // Supprimer un commentaire
    async deleteComment(id) {
        return api(`/comments/${id}`, {
            method: 'DELETE',
        })
    },

    // Récupérer tous les commentaires d'un utilisateur
    async getUserComments(userId) {
        return api(`/comments?user.id=${userId}&order[createdAt]=desc`, {
            method: 'GET',
        })
    },

    // Récupérer un commentaire spécifique
    async getCommentById(id) {
        return api(`/comments/${id}`, {
            method: 'GET',
        })
    }
}