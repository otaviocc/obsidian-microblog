import { EmptyResponse } from '@base/networking/EmptyResponse'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'

export interface UpdateViewModelDelegate {

    // Triggered when user clicks the delete button when the
    // title property is reset.
    updateDidClearTitle(): void

    // Triggered when updating a post succeeds.
    updateDidSucceed(): void

    // Triggered when updating a new post fails.
    updateDidFail(error: Error): void

    // Triggered when the network request starts.
    updateRequestDidStart(): void
}

export class UpdateViewModel {

    // Properties

    public delegate?: UpdateViewModelDelegate
    private isSubmitting: boolean
    private titleWrappedValue: string
    private content: string
    private blogID: string
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface
    readonly url: string

    // Life cycle

    constructor(
        url: string,
        title: string,
        content: string,
        blogID: string,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface
    ) {
        this.url = url
        this.titleWrappedValue = title
        this.content = content
        this.blogID = blogID
        this.networkClient = networkClient
        this.networkRequestFactory = networkRequestFactory
        this.isSubmitting = false
    }

    // Public

    public async updateNote() {
        this.isSubmitting = true
        this.delegate?.updateRequestDidStart()

        try {
            const request = this.networkRequestFactory.makeUpdatePostRequest(
                this.url,
                this.blogID,
                this.title,
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

    public get title(): string {
        return this.titleWrappedValue
    }

    public set title(value: string) {
        this.titleWrappedValue = value
    }

    public clearTitle() {
        this.title = ''
        this.delegate?.updateDidClearTitle()
    }

    public get showPublishingButton(): boolean {
        return this.isSubmitting
    }
}
