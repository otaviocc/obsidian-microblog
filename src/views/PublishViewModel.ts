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
    public blogs: Record<string, string>
    private titleWrappedValue: string
    private content: string
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
        blogs: Record<string, string>,
        selectedBlogID: string,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface
    ) {
        this.titleWrappedValue = ''
        this.content = content
        this.tagsWrappedValue = tags
        this.visibilityWrappedValue = visibility
        this.blogs = blogs
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
        console.log('Post title changed: ' + value)
    }

    public get tags(): string {
        return this.tagsWrappedValue
    }

    public set tags(value: string) {
        this.tagsWrappedValue = value
        console.log('Post tags changed: ' + value)
    }

    public get visibility(): string {
        return this.visibilityWrappedValue
    }

    public set visibility(value: string) {
        this.visibilityWrappedValue = value
        console.log('Post visibility changed: ' + value)
    }

    public get hasMultipleBlogs(): boolean {
        return Object.keys(this.blogs).length > 1
    }

    public get selectedBlogID(): string {
        return this.selectedBlogIDWrappedValue
    }

    public set selectedBlogID(value: string) {
        this.selectedBlogIDWrappedValue = value
        console.log('Selected blog changed: ' + value)
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