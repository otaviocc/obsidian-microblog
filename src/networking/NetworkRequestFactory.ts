import { NetworkRequest } from '@networking/NetworkRequest'

export interface NetworkRequestFactoryInterface {
    makePublishRequest(
        title: string,
        content: string,
        tags: string,
        visibility: string,
        blogID: string
    ): NetworkRequest

    makeConfigRequest(): NetworkRequest
}

export class NetworkRequestFactory implements NetworkRequestFactoryInterface {

    // Public

    public makePublishRequest(
        title: string,
        content: string,
        tags: string,
        visibility: string,
        blogID: string
    ): NetworkRequest {
        const parameters = new URLSearchParams([
            ['h', 'entry'],
            ['content', content],
            ['post-status', visibility]
        ])

        if (title.length > 0) {
            parameters.append('name', title)
        }

        if (blogID.length > 0) {
            parameters.append('mp-destination', blogID)
        }

        tags
            .split(",")
            .forEach(value => {
                parameters.append('category[]', value.trim())
            })

        return new NetworkRequest(
            '/micropub',
            parameters,
            'POST'
        )
    }

    public makeConfigRequest(): NetworkRequest {
        return new NetworkRequest(
            '/micropub',
            new URLSearchParams([
                ['q', 'config']
            ]),
            'GET'
        )
    }
}