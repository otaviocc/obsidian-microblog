import { NetworkRequest } from 'source/NetworkRequest'

export function makePublishRequest(title: string, content: string, visiblity: string): NetworkRequest {
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

export type PublishResponse = {
	url: string
	preview: string
    edit: string
}