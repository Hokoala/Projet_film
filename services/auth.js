import { useSession } from '@/stores/session.js'

export async function auth (url, params = {}) {
    const session = useSession()

    const runtimeConfig = useRuntimeConfig()

    const BASE_URL = runtimeConfig.public.apiUrl
    params = Object.assign({
        mode: 'cors',
        cache: 'no-cache',
    }, params)

    params.headers = Object.assign({
        'Content-Type': 'application/json'
    }, params.headers)

    let response = await fetch(BASE_URL + url, params)
    let json = await response.json() || {}
    if (!response.ok){
        let errorMessage = json.error || response.status
        throw new Error(errorMessage)
    }
    return json
}
