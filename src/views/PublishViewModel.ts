import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { PublishResponse } from '@networking/PublishResponse'

export interface PublishViewModelDelegate {
    publishDidSucceed(response: PublishResponse): void
    publishDidFail(error: Error): void
}

export class PublishViewModel {

    // Properties

    public delegate?: PublishViewModelDelegate
    private titleWrappedValue: string
    private contentWrappedValue: string
    private visibilityWrappedValue: string
    private tagsWrappedValue: string
    private selectedBlogIDWrappedValue: string
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface

    // Life cycle

    constructor(
        content: string,
        tags: string,
        visibility: string,
        selectedBlogID: string,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface
    ) {
        this.titleWrappedValue = ""
        this.contentWrappedValue = content
        this.tagsWrappedValue = tags
        this.visibilityWrappedValue = visibility
        this.selectedBlogIDWrappedValue = selectedBlogID
        this.networkClient = networkClient
        this.networkRequestFactory = networkRequestFactory
    }

    // Public

    public get title(): string {
        return this.titleWrappedValue
    }

    public set title(value: string) {
        this.titleWrappedValue = value
        console.log("Post title change :" + value)
    }

    public get content(): string {
        return this.contentWrappedValue
    }

    public get tags(): string {
        return this.tagsWrappedValue
    }

    public set tags(value: string) {
        this.tagsWrappedValue = value
        console.log("Post tags changed: " + value)
    }

    public get visibility(): string {
        return this.visibilityWrappedValue
    }

    public set visibility(value: string) {
        this.visibilityWrappedValue = value
        console.log("Post visibility change: " + value)
    }

    public get selectedBlogID(): string {
        return this.selectedBlogIDWrappedValue
    }

    public async publishNote() {
        const request = this.networkRequestFactory.makePublishRequest(
            this.title,
            this.content,
            this.tags,
            this.visibility,
            this.selectedBlogID
        )

        await this.networkClient
            .run<PublishResponse>(request)
            .then(response => {
                this.delegate?.publishDidSucceed(response)
            })
            .catch(error => {
                this.delegate?.publishDidFail(error)
            })
    }
}