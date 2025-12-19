import { useSession } from '@/stores/session.js'

const API_URL = 'http://localhost:8319'

export default {
    // Upload une image vers media_objects
    async uploadImage(file) {
        const session = useSession()
        const token = session.token || localStorage.getItem('token')

        if (!token) {
            throw new Error('Non authentifié')
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(`${API_URL}/api/media_objects`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/ld+json',
            }
        })

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Session expirée')
            }
            throw new Error(`Erreur ${response.status}`)
        }

        const data = await response.json()
        let imageUrl = data.contentUrl || data.url || data.filePath || data.path || data['@id']

        // Convertir URL relative en absolue
        if (imageUrl?.startsWith('/')) {
            imageUrl = API_URL + imageUrl
        }

        return {
            id: data.id || data['@id'],
            url: imageUrl,
            data: data
        }
    },

    // Supprimer une image
    async deleteImage(mediaId) {
        const session = useSession()
        const token = session.token || localStorage.getItem('token')

        if (!token) {
            throw new Error('Non authentifié')
        }

        // Extraire l'ID si c'est une URI IRI
        const id = mediaId.includes('/') ? mediaId.split('/').pop() : mediaId

        const response = await fetch(`${API_URL}/api/media_objects/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/ld+json',
            }
        })

        if (!response.ok && response.status !== 204) {
            throw new Error(`Erreur suppression: ${response.status}`)
        }

        return true
    },

    // Mettre à jour l'image de profil de l'utilisateur
    async updateUserProfileImage(userId, mediaObjectIRI) {
        const session = useSession()
        const token = session.token || localStorage.getItem('token')

        if (!token) {
            throw new Error('Non authentifié')
        }

        const response = await fetch(`${API_URL}/api/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/merge-patch+json',
                'Accept': 'application/ld+json',
            },
            body: JSON.stringify({
                profileImage: mediaObjectIRI
            })
        })

        if (!response.ok) {
            throw new Error(`Erreur mise à jour profil: ${response.status}`)
        }

        return await response.json()
    },

    // Mettre à jour le poster d'un film (admin)
    async updateFilmPoster(filmId, mediaObjectIRI) {
        const session = useSession()
        const token = session.token || localStorage.getItem('token')

        if (!token) {
            throw new Error('Non authentifié')
        }

        const response = await fetch(`${API_URL}/api/movies/${filmId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/merge-patch+json',
                'Accept': 'application/ld+json',
            },
            body: JSON.stringify({
                poster: mediaObjectIRI
            })
        })

        if (!response.ok) {
            throw new Error(`Erreur mise à jour film: ${response.status}`)
        }

        return await response.json()
    }
}
