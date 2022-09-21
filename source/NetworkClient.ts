import { StoredSettings } from 'source/StoredSettings'
import { NetworkRequest } from 'source/NetworkRequest'

export class NetworkClient {
    settings: StoredSettings

    constructor(settings: StoredSettings) {
        this.settings = settings
    }

    async run<T>(request: NetworkRequest): Promise<string | T> {
        try {
            const encodedParameters = new URLSearchParams(request.parameters)
            const url = `https://micro.blog${request.path}?${encodedParameters}`

            const response = await fetch(url, {
                method: request.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.settings.appToken}`
                }
            })
    
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`)
            }
    
            const result = (await response.json()) as T
            console.log('result is: ', JSON.stringify(result, null, 4))
    
            return result
        } catch (error) {
            if (error instanceof Error) {
                console.log('error message: ', error.message)
                return error.message
            } else {
                console.log('unexpected error: ', error)
                return 'An unexpected error occurred'
            }
        }
    }
}
