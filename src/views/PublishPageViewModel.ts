import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { PublishResponse } from '@networking/PublishResponse'
import { FrontmatterServiceInterface } from '@services/FrontmatterService'
import { ImageServiceInterface, ImageServiceDelegate } from '@services/ImageService'

/*
 * `PublishPageViewModelDelegate` interface, implemented by
 * the object that needs to observe events from the view model.
 */
export interface PublishPageViewModelDelegate {

    // Triggered when user clicks the clear title button.
    publishDidClearTitle(): void

    // Triggered when publishing a new page succeeds.
    publishDidSucceed(response: PublishResponse): void

    // Triggered when publishing a new page fails.
    publishDidFail(error: Error): void

    // Triggered after checking whether the title is
    // present or not. It returns `true` for valid date,
    // and false for invalid dates.
    publishDidValidateTitle(): void

    // Triggered when image processing status is updated
    publishDidUpdateImageProcessingStatus(status: string): void
}

/*
 * This view model drives the content and interactions with the
 * publish page view.
 */
export class PublishPageViewModel implements ImageServiceDelegate {

    // Properties

    public delegate?: PublishPageViewModelDelegate
    readonly blogs: Record<string, string>
    private isSubmitting: boolean
    private titleWrappedValue: string
    private content: string
    private selectedBlogIDWrappedValue: string
    private includeInNavigationWrappedValue: boolean
    private networkClient: NetworkClientInterface
    private frontmatterService: FrontmatterServiceInterface
    private networkRequestFactory: NetworkRequestFactoryInterface
    private imageService: ImageServiceInterface
    private totalImagesToProcess = 0
    private processedImagesCount = 0

    // Life cycle

    constructor(
        title: string,
        content: string,
        blogs: Record<string, string>,
        selectedBlogID: string,
        includeInNavigation: boolean,
        networkClient: NetworkClientInterface,
        frontmatterService: FrontmatterServiceInterface,
        networkRequestFactory: NetworkRequestFactoryInterface,
        imageService: ImageServiceInterface
    ) {
        this.titleWrappedValue = title
        this.content = content
        this.blogs = blogs
        this.selectedBlogIDWrappedValue = selectedBlogID
        this.includeInNavigationWrappedValue = includeInNavigation
        this.isSubmitting = false
        this.networkClient = networkClient
        this.frontmatterService = frontmatterService
        this.networkRequestFactory = networkRequestFactory
        this.imageService = imageService
        this.imageService.delegate = this
    }

    // Public

    public get title(): string {
        return this.titleWrappedValue
    }

    public set title(value: string) {
        this.titleWrappedValue = value
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

    public get includeInNavigation(): boolean {
        return this.includeInNavigationWrappedValue
    }

    public set includeInNavigation(value: boolean) {
        this.includeInNavigationWrappedValue = value
    }

    public clearTitle() {
        this.title = ''
        this.delegate?.publishDidClearTitle()
    }

    public get showPublishingButton(): boolean {
        return this.hasValidTitle && this.isSubmitting
    }

    public get missingTitleText(): string {
        return this.hasValidTitle ? '' : 'Title is mandatory'
    }

    public async publishPage() {
        if (!this.hasValidTitle) {
            this.isSubmitting = false
            this.delegate?.publishDidValidateTitle()
            return
        }

        this.isSubmitting = true
        this.delegate?.publishDidValidateTitle()

        try {
            const processedContent = await this.imageService.processContent(
                this.content,
                this.selectedBlogID
            )

            if (this.isSubmitting) {
                this.delegate?.publishDidUpdateImageProcessingStatus(
                    'Sending page to Micro.blog...'
                )

                const response = this.networkRequestFactory.makePublishPageRequest(
                    this.title,
                    processedContent,
                    this.selectedBlogID,
                    this.includeInNavigation
                )

                const result = await this.networkClient.run<PublishResponse>(
                    response
                )

                this.frontmatterService.save(this.title, 'title')
                this.frontmatterService.save(result.url, 'url')

                this.delegate?.publishDidSucceed(result)
            }
        } catch (error) {
            this.delegate?.publishDidFail(error)
        }
    }

    // ImageServiceDelegate

    public imageProcessingDidBegin(
        totalImages: number
    ): void {
        this.totalImagesToProcess = totalImages
        this.processedImagesCount = 0
        this.delegate?.publishDidUpdateImageProcessingStatus(
            `Processing images (0/${totalImages})...`
        )
    }

    public imageDidProcess(
        path: string,
        success: boolean,
        remoteURL?: string
    ): void {
        this.processedImagesCount++
        this.delegate?.publishDidUpdateImageProcessingStatus(
            `Processing images (${this.processedImagesCount}/${this.totalImagesToProcess})...`
        )
    }

    public imageProcessingDidComplete(): void {
        this.delegate?.publishDidUpdateImageProcessingStatus(
            `All ${this.totalImagesToProcess} images processed`
        )
    }

    public imageProcessingDidFail(
        error: Error,
    ): void {
        this.isSubmitting = false
        this.delegate?.publishDidFail(
            new Error(`Image processing failed: ${error.message}`)
        )
    }

    // Private

    private get hasValidTitle(): boolean {
        return this.titleWrappedValue.length > 0
    }
}
