import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { PublishResponse } from '@networking/PublishResponse'

export enum SubmitButtonStyle {
    Disabled,
    Publishing,
    Enabled
}

enum TextLengthLimit {
    MinLength = 0,
    MaxLength = 300
}

/*
 * `MicropostViewModelDelegate` interface, implemented by
 * the object that needs to observe events from the view model.
 */
export interface MicropostViewModelDelegate {

    // Triggered when the view needs to update the character count
    // fir the number of text-only characters in the post.
    publishUpdateCounter(string: string): void

    // Triggered when the submit button needs to be updated.
    publishUpdateSubmitButton(style: SubmitButtonStyle): void

    // Triggered when publishing a new post succeeds.
    publishDidSucceed(response: PublishResponse): void

    // Triggered when publishing a new post fails.
    publishDidFail(error: Error): void
}

/*
 * This view model drives the content and interactions with the
 * micropost view.
 */
export class MicropostViewModel {

    // Properties

    public delegate?: MicropostViewModelDelegate
    readonly blogs: Record<string, string>
    private isSubmitting: boolean
    private contentWrappedValue: string
    private plainTextContent: string
    private visibilityWrappedValue: string
    private selectedBlogIDWrappedValue: string
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface

    // Life cycle

    constructor(
        visibility: string,
        blogs: Record<string, string>,
        selectedBlogID: string,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface
    ) {
        this.visibilityWrappedValue = visibility
        this.contentWrappedValue = ''
        this.plainTextContent = ''
        this.blogs = blogs
        this.selectedBlogIDWrappedValue = selectedBlogID
        this.networkClient = networkClient
        this.networkRequestFactory = networkRequestFactory
        this.isSubmitting = false
    }

    // Public

    public get content(): string {
        return this.contentWrappedValue
    }

    public set content(value: string) {
        this.contentWrappedValue = value
        this.plainTextContent = this.markdownToPlainText(value)

        this.delegate?.publishUpdateCounter(this.characterCounterText)
        this.publishButtonStyle()
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

    public get characterCounterText(): string {
        return this.plainTextContent.length + '/300'
    }

    public async publish() {
        this.isSubmitting = true
        this.publishButtonStyle()

        try {
            const request = this.networkRequestFactory.makePublishPostRequest(
                '',
                this.content,
                [],
                this.visibility,
                this.selectedBlogID,
                ''
            )

            const result = await this.networkClient.run<PublishResponse>(
                request
            )

            this.delegate?.publishDidSucceed(result)
        } catch (error) {
            this.delegate?.publishDidFail(error)
        }
    }

    // Private

    private publishButtonStyle() {
        const isContentInvalid = this.plainTextContent.length <= TextLengthLimit.MinLength ||
                                 this.plainTextContent.length > TextLengthLimit.MaxLength

        if (isContentInvalid) {
            this.delegate?.publishUpdateSubmitButton(SubmitButtonStyle.Disabled)
            return
        }

        if (this.isSubmitting) {
            this.delegate?.publishUpdateSubmitButton(SubmitButtonStyle.Publishing)
            return
        }

        this.delegate?.publishUpdateSubmitButton(SubmitButtonStyle.Enabled)
    }

    private markdownToPlainText(
        markdown: string
    ): string {
        return markdown
            .replace(/^#+\s+/gm, '')
            .replace(/(\*\*|__)(.*?)\1/g, '$2')
            .replace(/(\*|_)(.*?)\1/g, '$2')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
            .replace(/(\n-{3,}|\n>{1,}.+)/g, '')
            .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
            .replace(/^\s*[\d.\-+*]\s+/gm, '')
            .split('\n')
            .map(line => line.trim())
            .join(' ')
            .replace(/\s{2,}/g, ' ')
            .trim()
    }
}
