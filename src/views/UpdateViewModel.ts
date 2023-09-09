import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { EmptyResponse } from '@base/networking/EmptyResponse'

export interface UpdateViewModelDelegate {

    // Triggered when updating a post succeeds.
    updateDidSucceed(): void

    // Triggered when updating a new post fails.
    updateDidFail(error: Error): void
}

export class UpdateViewModel {

    // Properties

    public delegate?: UpdateViewModelDelegate
    private isSubmitting: boolean
    private content: string
    private selectedBlogIDWrappedValue: string
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface
    readonly url: string
    readonly blogs: Record<string, string>

    // Life cycle

    constructor(
        url: string,
        content: string,
        blogs: Record<string, string>,
        selectedBlogID: string,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface
    ) {
        this.url = url
        this.content = content
        this.blogs = blogs
        this.selectedBlogIDWrappedValue = selectedBlogID
        this.networkClient = networkClient
        this.networkRequestFactory = networkRequestFactory
        this.isSubmitting = false
    }

    // Public

    public async updateNote() {
        this.isSubmitting = true

        try {
            const request = this.networkRequestFactory.makeUpdatePostRequest(
                this.url,
                this.selectedBlogIDWrappedValue,
                this.content
            )

            await this.networkClient.run<EmptyResponse>(
                request
            )

            this.delegate?.updateDidSucceed()
        } catch (error) {
            this.delegate?.updateDidFail(error)
        }
    }

    public get hasMultipleBlogs(): boolean {
        return Object.keys(this.blogs).length > 2
    }

    public get selectedBlogID(): string {
        return this.selectedBlogIDWrappedValue
    }

    public set selectedBlogID(value: string) {
        this.selectedBlogIDWrappedValue = value
    }

    public get showPublishingButton(): boolean {
        return this.isSubmitting
    }
}
