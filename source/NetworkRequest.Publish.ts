import { NetworkRequest } from 'source/NetworkRequest'

export function makePublishRequest(content: string, visiblity: string): NetworkRequest {
    return new NetworkRequest(
        "/micropub",
        {
            "h": "entry",
            "content": content,
            "post-status": visiblity
        },
        "POST"
    )
}

export type PublishResponse = {
	url: string
	preview: string
}