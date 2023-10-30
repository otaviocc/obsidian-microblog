import { EmptyResponse } from '@networking/EmptyResponse'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'

/*
 * `UpdatePostViewModelDelegate` interface, implemented by
 * the object that needs to observe events from the view model.
 */
export interface UpdatePostViewModelDelegate {

    // Triggered when user clicks the delete button when the
    // title property is reset.
    updateDidClearTitle(): void

    // Triggered when updating a post succeeds.
    updateDidSucceed(): void

    // Triggered when updating a post fails.
    updateDidFail(error: Error): void

    // Triggered when the network request starts.
    updateRequestDidStart(): void
}

/*
 * This view model drives the content and interactions with the
 * update view.
 */
export class UpdatePostViewModel {

    // Properties

    public delegate?: UpdatePostViewModelDelegate
    private isSubmitting: boolean
    private titleWrappedValue: string
    private content: string
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface
    private selectedBlogIDWrappedValue: string
    readonly url: string
    readonly blogs: Record<string, string>

    // Life cycle

    constructor(
        url: string,
        title: string,
        content: string,
        blogs: Record<string, string>,
        selectedBlogID: string,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface
    ) {
        this.url = url
        this.titleWrappedValue = title
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
        this.delegate?.updateRequestDidStart()

        try {
            const request = this.networkRequestFactory.makeUpdateRequest(
                this.url,
                this.selectedBlogID,
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

    public get hasMultipleBlogs(): boolean {
        return Object.keys(this.blogs).length > 2
    }

    public get selectedBlogID(): string {
        return this.selectedBlogIDWrappedValue
    }

    public set selectedBlogID(value: string) {
        this.selectedBlogIDWrappedValue = value
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

    public get showUpdatingButton(): boolean {
        return this.isSubmitting
    }
}
