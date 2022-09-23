import { NetworkRequest } from '@networking/NetworkRequest'

export interface NetworkRequestFactoryInterface {
    makePublishRequest(
        title: string,
        content: string,
        tags: string,
        visiblity: string
    ): NetworkRequest

    makeConfigRequest(): NetworkRequest
}

export class NetworkRequestFactory implements NetworkRequestFactoryInterface {

    makePublishRequest(
        title: string,
        content: string,
        tags: string,
        visiblity: string
    ): NetworkRequest {
        const parameters = new URLSearchParams([
            ['h', 'entry'],
            ['name', title],
            ['content', content],
            ['post-status', visiblity]
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

    makeConfigRequest(): NetworkRequest {
        return new NetworkRequest(
            "/micropub",
            new URLSearchParams([
                ['q', 'config']
            ]),
            "GET"           
        )
    }
}