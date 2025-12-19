import { useSession } from '@/stores/session.js'
export async function api (url, params = {}) {
    const session = useSession()

    const runtimeConfig = useRuntimeConfig()

    const BASE_URL = 'http://localhost:8319/api'
    params = Object.assign({
        mode: 'cors',
        cache: 'no-cache',
    }, params)

    // console.log('Session Token:', session.token)
    // Utiliser application/ld+json pour les requêtes POST/PUT/PATCH (API Platform)
    const contentType = ['POST', 'PUT', 'PATCH'].includes(params.method)
        ? 'application/ld+json'
        : 'application/json'

    params.headers = Object.assign({
        Authorization: `Bearer ${session.token}`,
        'Content-Type': contentType,
        'Accept': 'application/ld+json'
    }, params.headers)

    let response = await fetch(BASE_URL + url, params)

    // Pour les réponses 204 No Content (DELETE), pas de JSON à parser
    if (response.status === 204) {
        return {}
    }

    let json = await response.json() || {}
    if (!response.ok){
        // console.error('API Error:', response.status, json)
        let errorMessage = json['hydra:description'] || json.detail || json.error || json.message || response.status
        throw new Error(errorMessage)
    }
    return json
}