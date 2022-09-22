import { NetworkRequest } from './NetworkRequest'

export interface NetworkClientInterface {
    run<T>(request: NetworkRequest): Promise<T>
}

export class NetworkClient implements NetworkClientInterface {

    private appToken: () => string

    constructor(
        appToken: () => string
    ) {
        this.appToken = appToken
    }

    async run<T>(request: NetworkRequest): Promise<T> {
        const url = "https://micro.blog" + request.path + "?" + request.parameters

        const response = await fetch(url, {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': "Bearer " + this.appToken()
            }
        })

        if (!response.ok) {
            throw new Error('Error ' + response.status)
        }

        const result = (await response.json()) as T
        console.log('result is: ', JSON.stringify(result, null, 4))

        return result
    }
}