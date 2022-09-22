import { NetworkRequestFactoryInterface } from './NetworkRequestFactory'
import { NetworkClientInterface } from './NetworkClient'
import { PublishResponse } from './PublishResponse'

export class PublishViewModel {

    readonly hasAppToken: boolean
    private titleWrappedValue: string
    private contentWrappedValue: string
    private visibilityWrappedValue: string
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface

    constructor(
        content: string,
        visibility: string,
        hasAppToken: boolean,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface
    ) {
        this.titleWrappedValue = ""
        this.contentWrappedValue = content
        this.visibilityWrappedValue = visibility
        this.hasAppToken = hasAppToken
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