import { NetworkRequestFactoryInterface, PublishResponse } from './NetworkRequestFactory'
import { NetworkClientInterface } from './NetworkClient'

export class PublishViewModel {

    private titleWrappedValue: string
    private contentWrappedValue: string
    private visibilityWrappedValue: string
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface

    constructor(
        content: string,
        visibility: string,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface
    ) {
        this.titleWrappedValue = ""
        this.contentWrappedValue = content
        this.visibilityWrappedValue = visibility
        this.networkClient = networkClient
        this.networkRequestFactory = networkRequestFactory
    }

    get title(): string {
        return this.titleWrappedValue
    }

    set title(value: string) {
        this.titleWrappedValue = value
        console.log("Post title change :" + value)
    }

    get content(): string {
        return this.contentWrappedValue
    }

    get visibility(): string {
        return this.visibilityWrappedValue
    }

    set visibility(value: string) {
        this.visibilityWrappedValue = value
        console.log("Post visibility change: " + value)
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