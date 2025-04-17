import { ViewModelFactoryInterface } from '@factories/ViewModelFactory'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { PublishResponse } from '@networking/PublishResponse'
import { FrontmatterServiceInterface } from '@services/FrontmatterService'
import { ImageServiceInterface, ImageServiceDelegate } from '@services/ImageService'
import { TagSuggestionDelegate, TagSuggestionViewModel } from '@views/TagSuggestionViewModel'

/*
 * `UpdatePostViewModelDelegate` interface, implemented by
 * the object that needs to observe events from the view model.
 */
export interface UpdatePostViewModelDelegate {

    // Triggered when user clicks the delete button when the
    // title property is reset.
    updateDidClearTitle(): void

    // Triggered when updating a post succeeds.
    updateDidSucceed(result: PublishResponse): void

    // Triggered when updating a post fails.
    updateDidFail(error: Error): void

    // Triggered when selecting a tag from the picker.
    updateDidSelectTag(): void

    // Triggered when the network request starts.
    updateRequestDidStart(): void

    // Triggered when image processing status is updated
    updateDidUpdateImageProcessingStatus(status: string): void
}

/*
 * This view model drives the content and interactions with the
 * update view.
 */
export class UpdatePostViewModel implements TagSuggestionDelegate, ImageServiceDelegate {

    // Properties

    public delegate?: UpdatePostViewModelDelegate
    readonly url: string
    readonly blogs: Record<string, string>
    private isSubmitting: boolean
    private blogID: string
    private titleWrappedValue: string
    private content: string
    private tagsWrappedValue: string
    private frontmatterService: FrontmatterServiceInterface
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface
    private viewModelFactory: ViewModelFactoryInterface
    private imageService: ImageServiceInterface
    private totalImagesToProcess = 0
    private processedImagesCount = 0

    // Life cycle

    constructor(
        url: string,
        title: string,
        content: string,
        tags: string,
        blogs: Record<string, string>,
        blogID: string,
        frontmatterService: FrontmatterServiceInterface,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface,
        imageService: ImageServiceInterface,
        viewModelFactory: ViewModelFactoryInterface
    ) {
        this.url = url
        this.titleWrappedValue = title
        this.content = content
        this.tagsWrappedValue = tags
        this.blogs = blogs
        this.blogID = blogID
        this.isSubmitting = false
        this.frontmatterService = frontmatterService
        this.networkClient = networkClient
        this.networkRequestFactory = networkRequestFactory
        this.viewModelFactory = viewModelFactory
        this.imageService = imageService
        this.imageService.delegate = this
    }

    // Public

    public async updateNote() {
        this.isSubmitting = true
        this.delegate?.updateRequestDidStart()

        try {
            const tags = this.tags.validValues()

            const processedContent = await this.imageService.processContent(
                this.content,
                this.blogID
            )

            if (this.isSubmitting) {
                this.delegate?.updateDidUpdateImageProcessingStatus(
                    'Sending post to Micro.blog...'
                )

                const request = this.networkRequestFactory.makeUpdateRequest(
                    this.url,
                    this.blogID,
                    this.title,
                    processedContent,
                    tags
                )

                const result = await this.networkClient.run<PublishResponse>(
                    request
                )

                this.frontmatterService.save(this.title, 'title')
                this.frontmatterService.save(result.url, 'url')
                this.frontmatterService.save(tags, 'tags')

                this.delegate?.updateDidSucceed(result)
            }
        } catch (error) {
            this.delegate?.updateDidFail(error)
        }
    }

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

    public get tags(): string {
        return this.tagsWrappedValue
    }

    public set tags(value: string) {
        this.tagsWrappedValue = value
    }

    public get showUpdatingButton(): boolean {
        return this.isSubmitting
    }

    public clearTitle() {
        this.title = ''
        this.delegate?.updateDidClearTitle()
    }

    public suggestionsViewModel(): TagSuggestionViewModel {
        const excluding = this.tags.validValues()

        return this.viewModelFactory.makeTagSuggestionViewModel(
            this.blogID,
            excluding,
            this
        )
    }

    // TagSuggestionDelegate

    public tagSuggestionDidSelectTag(
        category: string
    ) {
        const tags = this.tags.validValues()
        tags.push(category)

        const formattedTags = tags
            .filter((tag, index) => index === tags.indexOf(tag))
            .join()

        this.tags = formattedTags
        this.delegate?.updateDidSelectTag()
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
}
