import { NetworkRequest } from '@networking/NetworkRequest'

export interface NetworkClientInterface {

    // Performs the network request. It takes a network request
    // and returns a Promise. `T` specifies the return type and is used
    // by the network client to decode the network payload.
    run<T>(request: NetworkRequest): Promise<T>
}

/*
 * Network Client used to perform all the network requests
 * in the plugin.
 *
 * The network client takes a closure which returns the application
 * token. This allows the app token to be resolved only when it's needed,
 */
export class NetworkClient implements NetworkClientInterface {

    // Properties

    private appToken: () => string

    // Life cycle

    constructor(
        appToken: () => string
    ) {
        this.appToken = appToken
    }

    // Public

    public async run<T>(request: NetworkRequest): Promise<T> {
        const url = 'https://micro.blog' + request.path + '?' + request.parameters

        const response = await fetch(url, {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.appToken()
            }
        })

        if (!response.ok) {
            throw new Error('Network error: ' + response.status)
        }

        return await response.json() as T
    }
}
