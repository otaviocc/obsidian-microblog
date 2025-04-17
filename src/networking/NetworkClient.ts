import { ErrorFactory } from '@factories/ErrorFactory'
import { NetworkRequest } from '@networking/NetworkRequest'
import { MediaRequest, makeMediaRequestBody } from '@networking/MediaRequest'
import { MediaResponse, extractMediaURL } from '@networking/MediaResponse'
import { requestUrl } from 'obsidian'
import '@extensions/RequestUrlResponse'

export interface NetworkClientInterface {

    // Performs the network request. It takes a network request
    // and returns a Promise. `T` specifies the return type and is used
    // by the network client to decode the network payload.
    run<T>(request: NetworkRequest): Promise<T>

    // Uploads a media file to Micro.blog media endpoint.
    // Returns a Promise with the URL of the uploaded media.
    uploadMedia(
        mediaRequest: MediaRequest
    ): Promise<string>
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
        const url = 'https://micro.blog' + request.path + (request.parameters ? '?' + request.parameters : '')

        const response = await fetch(url, {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.appToken()
            },
            body: request.body
        })

        if (!response.ok) {
            throw await ErrorFactory.makeErrorFromResponse(response)
        }

        const isSuccess = response.status >= 200 && response.status < 300
        const isEmptyBody = response.headers.get('content-length') === '0'

        if (isSuccess && isEmptyBody) {
            return {} as T
        }

        return await response.json() as T
    }

    public async uploadMedia(
        mediaRequest: MediaRequest
    ): Promise<string> {
        const { body, boundary } = makeMediaRequestBody(mediaRequest)
        const contentTypeHeader = `multipart/form-data; boundary=${boundary}`

        const response = await requestUrl({
            url: 'https://micro.blog/micropub/media',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.appToken(),
                'Content-Type': contentTypeHeader
            },
            body: body,
            throw: false
        })

        if (!response.ok) {
            throw new Error(`Media upload failed (${response.status}): ${response.text}`)
        }

        try {
            const jsonResponse = JSON.parse(response.text) as MediaResponse
            return extractMediaURL(jsonResponse, response.headers['location'])
        } catch (jsonError) {
            const location = response.headers['location']
            if (location) {
                return location
            }
            throw new Error('Unable to extract media URL from response')
        }
    }
}
