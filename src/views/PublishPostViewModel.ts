import { ViewModelFactoryInterface } from '@factories/ViewModelFactory'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { PublishResponse } from '@networking/PublishResponse'
import { FrontmatterServiceInterface } from '@services/FrontmatterService'
import { TagSuggestionDelegate, TagSuggestionViewModel } from '@views/TagSuggestionViewModel'

/*
 * `PublishPostViewModelDelegate` interface, implemented by
 * the object that needs to observe events from the view model.
 */
export interface PublishPostViewModelDelegate {

    // Triggered when user clicks the delete button when the
    // title property is reset.
    publishDidClearTitle(): void

    // Triggered when user clicks the clear button when the
    // date property is reset.
    publishDidClearDate(): void

    // Triggered when publishing a new post succeeds.
    publishDidSucceed(response: PublishResponse): void

    // Triggered when publishing a new post fails.
    publishDidFail(error: Error): void

    // Triggered when selecting a tag from the picker.
    publishDidSelectTag(): void

    // Triggered after checking whether the scheduled date
    // is valid or not. It returns `true` for no date or for
    // valid date, and false for invalid dates.
    publishDidValidateDate(): void
}

/*
 * This view model drives the content and interactions with the
 * publish post view.
 */
export class PublishPostViewModel implements TagSuggestionDelegate {

    // Properties

    public delegate?: PublishPostViewModelDelegate
    private isValidDate: boolean
    private isSubmitting: boolean
    private titleWrappedValue: string
    private content: string
    private visibilityWrappedValue: string
    private tagsWrappedValue: string
    private selectedBlogIDWrappedValue: string
    private scheduledDateWrappedValue: string
    private networkClient: NetworkClientInterface
    private frontmatterService: FrontmatterServiceInterface
    private networkRequestFactory: NetworkRequestFactoryInterface
    private viewModelFactory: ViewModelFactoryInterface
    readonly blogs: Record<string, string>

    // Life cycle

    constructor(
        title: string,
        content: string,
        tags: string,
        visibility: string,
        blogs: Record<string, string>,
        selectedBlogID: string,
        networkClient: NetworkClientInterface,
        frontmatterService: FrontmatterServiceInterface,
        networkRequestFactory: NetworkRequestFactoryInterface,
        viewModelFactory: ViewModelFactoryInterface
    ) {
        this.titleWrappedValue = title
        this.content = content
        this.tagsWrappedValue = tags
        this.visibilityWrappedValue = visibility
        this.blogs = blogs
        this.selectedBlogIDWrappedValue = selectedBlogID
        this.scheduledDateWrappedValue = ''
        this.isValidDate = true
        this.isSubmitting = false
        this.networkClient = networkClient
        this.frontmatterService = frontmatterService
        this.networkRequestFactory = networkRequestFactory
        this.viewModelFactory = viewModelFactory
    }

    // Public

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

    public get visibility(): string {
        return this.visibilityWrappedValue
    }

    public set visibility(value: string) {
        this.visibilityWrappedValue = value
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

    public get scheduledDate(): string {
        return this.scheduledDateWrappedValue
    }

    public set scheduledDate(value: string) {
        this.scheduledDateWrappedValue = value
    }

    public get showPublishingButton(): boolean {
        return this.isValidDate && this.isSubmitting
    }

    public get invalidDateText(): string {
        return this.isValidDate ? '' : 'Invalid date format'
    }

    public async publishNote() {
        if (!this.isValidScheduledDate()) {
            this.isValidDate = false
            this.isSubmitting = false
            this.delegate?.publishDidValidateDate()
            return
        }

        this.isValidDate = true
        this.isSubmitting = true
        this.delegate?.publishDidValidateDate()

        try {
            const tags = this.tags.validValues()

            const response = this.networkRequestFactory.makePublishPostRequest(
                this.title,
                this.content,
                tags,
                this.visibility,
                this.selectedBlogID,
                this.formattedScheduledDate()
            )

            const result = await this.networkClient.run<PublishResponse>(
                response
            )

            this.frontmatterService.save(this.title, 'title')
            this.frontmatterService.save(result.url, 'url')
            this.frontmatterService.save(tags, 'tags')

            this.delegate?.publishDidSucceed(result)
        } catch (error) {
            this.delegate?.publishDidFail(error)
        }
    }

    public clearTitle() {
        this.title = ''
        this.delegate?.publishDidClearTitle()
    }

    public suggestionsViewModel(): TagSuggestionViewModel {
        const excluding = this.tags.validValues()

        return this.viewModelFactory.makeTagSuggestionViewModel(
            this.selectedBlogID,
            excluding,
            this
        )
    }

    public clearDate() {
        this.scheduledDateWrappedValue = ''
        this.isValidDate = true
        this.delegate?.publishDidClearDate()
    }

    // Private

    private isValidScheduledDate(): boolean {
        const scheduledDate = new Date(this.scheduledDateWrappedValue)
        const isInvalidDate = isNaN(scheduledDate.getTime())

        if (this.scheduledDateWrappedValue.length > 0 && isInvalidDate) {
            return false
        }

        return true
    }

    private formattedScheduledDate(): string {
        const scheduledDate = new Date(this.scheduledDateWrappedValue.trim())
        const isInvalidDate = isNaN(scheduledDate.getTime())

        if (isInvalidDate) {
            return ''
        }

        return scheduledDate.toISOString()
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
        this.delegate?.publishDidSelectTag()
    }
}
