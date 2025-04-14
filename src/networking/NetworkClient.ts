import { ErrorFactory } from '@networking/ErrorFactory'
import { NetworkRequest } from '@networking/NetworkRequest'
import { requestUrl } from 'obsidian'

export interface NetworkClientInterface {

    // Performs the network request. It takes a network request
    // and returns a Promise. `T` specifies the return type and is used
    // by the network client to decode the network payload.
    run<T>(request: NetworkRequest): Promise<T>

    // Uploads a media file to Micro.blog media endpoint
    // Returns a Promise with the URL of the uploaded media
    uploadMedia(
        mediaBuffer: ArrayBuffer,
        filename: string,
        contentType: string,
        blogID?: string
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
        imageBuffer: ArrayBuffer,
        filename: string,
        contentType: string,
        blogID?: string
    ): Promise<string> {
        const boundary = `----WebKitFormBoundary${Math.random().toString(16).substr(2)}`
        const contentTypeHeader = `multipart/form-data; boundary=${boundary}`

        let formDataContent = ''

        formDataContent += `--${boundary}\r\n`
        formDataContent += `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`
        formDataContent += `Content-Type: ${contentType}\r\n\r\n`

        let postFileContent = ''

        if (blogID) {
            postFileContent += `\r\n--${boundary}\r\n`
            postFileContent += `Content-Disposition: form-data; name="mp-destination"\r\n\r\n`
            postFileContent += `${blogID}\r\n`
        }

        postFileContent += `--${boundary}--\r\n`

        const encoder = new TextEncoder()
        const formDataHeaders = encoder.encode(formDataContent)
        const formDataFooter = encoder.encode(postFileContent)
        const combinedData = new Uint8Array(
            formDataHeaders.length + imageBuffer.byteLength + formDataFooter.length
        )

        combinedData.set(formDataHeaders, 0)
        combinedData.set(new Uint8Array(imageBuffer), formDataHeaders.length)
        combinedData.set(formDataFooter, formDataHeaders.length + imageBuffer.byteLength)

        const response = await requestUrl({
            url: 'https://micro.blog/micropub/media',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.appToken(),
                'Content-Type': contentTypeHeader
            },
            body: combinedData.buffer,
            throw: false
        })

        if (response.status >= 200 && response.status < 300) {
            let mediaUrl = null

            try {
                const jsonResponse = JSON.parse(response.text)

                if (jsonResponse.url) {
                    mediaUrl = jsonResponse.url
                } else if (jsonResponse.photo) {
                    mediaUrl = typeof jsonResponse.photo === 'string'
                        ? jsonResponse.photo
                        : Array.isArray(jsonResponse.photo) && jsonResponse.photo.length > 0
                            ? jsonResponse.photo[0]
                            : null
                } else if (jsonResponse.location) {
                    mediaUrl = jsonResponse.location
                }
            } catch (jsonError) {
                const location = response.headers['location']

                if (location) {
                    mediaUrl = location
                }
            }

            if (mediaUrl) {
                return mediaUrl
            }

            const location = response.headers['location']

            if (location) {
                return location
            }

            throw new Error(`Could not determine media URL from successful response`)
        } else {
            throw new Error(`Upload failed with status ${response.status}: ${response.text}`)
        }
    }
}
