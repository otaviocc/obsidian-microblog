import { NetworkRequest } from './NetworkRequest'

export interface NetworkRequestFactoryInterface {
    makePublishRequest(
        title: string,
        content: string,
        visiblity: string
    ): NetworkRequest
}

export class NetworkRequestFactory implements NetworkRequestFactoryInterface {

    makePublishRequest(
        title: string,
        content: string,
        visiblity: string
    ): NetworkRequest {
        return new NetworkRequest(
            "/micropub",
            {
                "h": "entry",
                "name": title,
                "content": content,
                "post-status": visiblity
            },
            "POST"
        )
    }
}