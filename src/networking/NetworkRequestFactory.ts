import { NetworkRequest } from '@networking/NetworkRequest'

export interface NetworkRequestFactoryInterface {
    makePublishRequest(
        title: string,
        content: string,
        tags: string,
        visiblity: string,
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
        visiblity: string,
        blogID: string
    ): NetworkRequest {
        const parameters = new URLSearchParams([
            ['h', 'entry'],
            ['name', title],
            ['content', content],
            ['post-status', visiblity],
            ['mp-destination', blogID]
        ])

        tags
            .split(",")
            .forEach(value => {
                parameters.append("category[]", value.trim())
            })

        return new NetworkRequest(
            "/micropub",
            parameters,
            "POST"
        )
    }

    public makeConfigRequest(): NetworkRequest {
        return new NetworkRequest(
            "/micropub",
            new URLSearchParams([
                ['q', 'config']
            ]),
            "GET"           
        )
    }
}