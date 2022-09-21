import { StoredSettings } from 'source/StoredSettings'
import { makePublishRequest, PublishResponse } from 'source/NetworkRequest.Publish'
import { NetworkClient } from 'source/NetworkClient'

export class PublishViewModel {

    title: string
    content: string
    visibility: string
    networkClient: NetworkClient

    constructor(content: string, settings: StoredSettings) {
        this.title = ""
        this.content = content
        this.visibility = settings.postVisibility
        this.networkClient = new NetworkClient(settings)
    }

    async publishNote(): Promise<PublishResponse> {
        return this.networkClient.run<PublishResponse>(
            makePublishRequest(this.title, this.content, this.visibility)
        )
    }
}