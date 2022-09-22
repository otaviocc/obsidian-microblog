import { NetworkRequestFactoryInterface, PublishResponse } from './NetworkRequest.Publish'
import { NetworkClientInterface } from './NetworkClient'

export class PublishViewModel {

    title: string
    content: string
    visibility: string

    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface

    constructor(
        content: string,
        visibility: string,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface
    ) {
        this.title = ""
        this.content = content
        this.visibility = visibility
        this.networkClient = networkClient
        this.networkRequestFactory = networkRequestFactory
    }

    async publishNote(): Promise<PublishResponse> {
        const request = this.networkRequestFactory.makePublishRequest(
            this.title,
            this.content,
            this.visibility
        )

        return this.networkClient.run<PublishResponse>(request)
    }
}