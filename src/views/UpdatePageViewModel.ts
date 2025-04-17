import { EmptyResponse } from '@networking/EmptyResponse'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { FrontmatterServiceInterface } from '@services/FrontmatterService'
import { ImageServiceInterface, ImageServiceDelegate } from '@services/ImageService'

/*
 * `UpdatePageViewModelDelegate` interface, implemented by
 * the object that needs to observe events from the view model.
 */
export interface UpdatePageViewModelDelegate {

    // Triggered when user clicks the delete button when the
    // title property is reset.
    updateDidClearTitle(): void

    // Triggered when updating a page succeeds.
    updateDidSucceed(): void

    // Triggered when updating a page fails.
    updateDidFail(error: Error): void

    // Triggered when the network request starts.
    updateRequestDidStart(): void

    // Triggered when image processing status is updated
    updateDidUpdateImageProcessingStatus(status: string): void
}

/*
 * This view model drives the content and interactions with the
 * update page view.
 */
export class UpdatePageViewModel implements ImageServiceDelegate {

    // Properties

    public delegate?: UpdatePageViewModelDelegate
    readonly url: string
    readonly blogs: Record<string, string>
    private isSubmitting: boolean
    private titleWrappedValue: string
    private content: string
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface
    private blogID: string
    private frontmatterService: FrontmatterServiceInterface
    private imageService: ImageServiceInterface
    private totalImagesToProcess = 0
    private processedImagesCount = 0

    // Life cycle

    constructor(
        url: string,
        title: string,
        content: string,
        blogs: Record<string, string>,
        blogID: string,
        networkClient: NetworkClientInterface,
        frontmatterService: FrontmatterServiceInterface,
        networkRequestFactory: NetworkRequestFactoryInterface,
        imageService: ImageServiceInterface
    ) {
        this.url = url
        this.titleWrappedValue = title
        this.content = content
        this.blogs = blogs
        this.blogID = blogID
        this.isSubmitting = false
        this.networkClient = networkClient
        this.frontmatterService = frontmatterService
        this.networkRequestFactory = networkRequestFactory
        this.imageService = imageService
        this.imageService.delegate = this
    }

    public async updateNote() {
        if (!this.hasValidTitle) {
            this.isSubmitting = false
            this.delegate?.updateRequestDidStart()
            return
        }

        this.isSubmitting = true
        this.delegate?.updateRequestDidStart()

        try {
            const processedContent = await this.imageService.processContent(
                this.content,
                this.selectedBlogID
            )

            if (this.isSubmitting) {
                this.delegate?.updateDidUpdateImageProcessingStatus(
                    'Sending page to Micro.blog...'
                )

                const request = this.networkRequestFactory.makeUpdateRequest(
                    this.url,
                    this.selectedBlogID,
                    this.title,
                    processedContent
                )

                await this.networkClient.run<EmptyResponse>(
                    request
                )

                this.frontmatterService.save(this.title, 'title')
                this.frontmatterService.save(this.url, 'url')

                this.delegate?.updateDidSucceed()
            }
        } catch (error) {
            this.delegate?.updateDidFail(error)
        }
    }

    // ImageServiceDelegate

    public imageProcessingDidBegin(
        totalImages: number
    ): void {
        this.totalImagesToProcess = totalImages
        this.processedImagesCount = 0
        this.delegate?.updateDidUpdateImageProcessingStatus(
            `Processing images (0/${totalImages})...`
        )
    }

    public imageDidProcess(
        path: string,
        success: boolean,
        remoteURL?: string
    ): void {
        this.processedImagesCount++
        this.delegate?.updateDidUpdateImageProcessingStatus(
            `Processing images (${this.processedImagesCount}/${this.totalImagesToProcess})...`
        )
    }

    public imageProcessingDidComplete(): void {
        this.delegate?.updateDidUpdateImageProcessingStatus(
            `All ${this.totalImagesToProcess} images processed`
        )
    }

    public imageProcessingDidFail(
        error: Error,
    ): void {
        this.isSubmitting = false
        this.delegate?.updateDidFail(
            new Error(`Image processing failed: ${error.message}`)
        )
    }

    // Public

    public get hasMultipleBlogs(): boolean {
        return Object.keys(this.blogs).length > 2
    }

    public get selectedBlogID(): string {
        return this.blogID
    }

    public set selectedBlogID(value: string) {
        this.blogID = value
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
        return this.hasValidTitle && this.isSubmitting
    }

    public get missingTitleText(): string {
        return this.hasValidTitle ? '' : 'Title is mandatory'
    }

    // Private

    private get hasValidTitle(): boolean {
        return this.titleWrappedValue.length > 0
    }
}
