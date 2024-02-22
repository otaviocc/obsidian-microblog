import { ViewModelFactoryInterface } from '@factories/ViewModelFactory'
import { EmptyResponse } from '@networking/EmptyResponse'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { FrontmatterServiceInterface } from '@services/FrontmatterService'
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
    updateDidSucceed(): void

    // Triggered when updating a post fails.
    updateDidFail(error: Error): void

    // Triggered when selecting a tag from the picker.
    updateDidSelectTag(): void

    // Triggered when the network request starts.
    updateRequestDidStart(): void
}

/*
 * This view model drives the content and interactions with the
 * update view.
 */
export class UpdatePostViewModel implements TagSuggestionDelegate {

    // Properties

    public delegate?: UpdatePostViewModelDelegate
    private isSubmitting: boolean
    private titleWrappedValue: string
    private content: string
    private tagsWrappedValue: string
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface
    private selectedBlogIDWrappedValue: string
    private frontmatterService: FrontmatterServiceInterface
    private viewModelFactory: ViewModelFactoryInterface
    readonly url: string
    readonly blogs: Record<string, string>

    // Life cycle

    constructor(
        url: string,
        title: string,
        content: string,
        tags: string,
        blogs: Record<string, string>,
        selectedBlogID: string,
        networkClient: NetworkClientInterface,
        frontmatterService: FrontmatterServiceInterface,
        networkRequestFactory: NetworkRequestFactoryInterface,
        viewModelFactory: ViewModelFactoryInterface
    ) {
        this.url = url
        this.titleWrappedValue = title
        this.content = content
        this.tagsWrappedValue = tags
        this.blogs = blogs
        this.selectedBlogIDWrappedValue = selectedBlogID
        this.networkClient = networkClient
        this.frontmatterService = frontmatterService
        this.networkRequestFactory = networkRequestFactory
        this.viewModelFactory = viewModelFactory
        this.isSubmitting = false
    }

    // Public

    public async updateNote() {
        this.isSubmitting = true
        this.delegate?.updateRequestDidStart()

        try {
            const tags = this.tags.nonEmptyValues()

            const request = this.networkRequestFactory.makeUpdateRequest(
                this.url,
                this.selectedBlogID,
                this.title,
                this.content,
                tags
            )

            await this.networkClient.run<EmptyResponse>(
                request
            )

            this.frontmatterService.save(this.title, 'title')
            this.frontmatterService.save(tags, 'tags')

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
        const excluding = this.tags.nonEmptyValues()

        return this.viewModelFactory.makeTagSuggestionViewModel(
            this.selectedBlogID,
            excluding,
            this
        )
    }

    // TagSuggestionDelegate

    public tagSuggestionDidSelectTag(
        category: string
    ) {
        const tags = this.tags.nonEmptyValues()
        tags.push(category)

        const formattedTags = tags
            .filter((tag, index) => index === tags.indexOf(tag))
            .join()

        this.tags = formattedTags
        this.delegate?.updateDidSelectTag()
    }
}
