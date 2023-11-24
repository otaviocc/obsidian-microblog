import { NetworkClientInterface } from "@networking/NetworkClient";
import { NetworkRequestFactoryInterface } from "@networking/NetworkRequestFactory";
import { PublishResponse } from "@networking/PublishResponse";

export enum SubmitButtonStyle {
    Disabled,
    Publishing,
    Enabled
}

/*
 * `ComposeViewModelDelegate` interface, implemented by
 * the object that needs to observe events from the view model.
 */
export interface ComposeViewModelDelegate {

    // Triggered when the view needs to update the character count
    // fir the number of text-only characters in the post.
    publishUpdateCounter(string: string): void

    // Triggered when the submit button needs to be updated.
    publicUpdateSubmitButton(style: SubmitButtonStyle): void

    // Triggered when publishing a new post succeeds.
    publishDidSucceed(response: PublishResponse): void

    // Triggered when publishing a new post fails.
    publishDidFail(error: Error): void
}

/*
 * This view model drives the content and interactions with the
 * compose view.
 */
export class ComposeViewModel {

    // Properties

    public delegate?: ComposeViewModelDelegate
    private isSubmitting: boolean
    private contentWrappedValue: string
    private visibilityWrappedValue: string
    private selectedBlogIDWrappedValue: string
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface
    readonly blogs: Record<string, string>

    // Life cycle

    constructor(
        visibility: string,
        blogs: Record<string, string>,
        selectedBlogID: string,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface
    ) {
        this.visibilityWrappedValue = visibility
        this.contentWrappedValue = ""
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
        return this.content.length + '/300'
    }

    public async publish() {
        this.isSubmitting = true
        this.publishButtonStyle()

        try {
            const request = this.networkRequestFactory.makePublishPostRequest(
                "",
                this.content,
                "",
                this.visibility,
                this.selectedBlogID,
                ""
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
        if (this.content.length == 0 || this.content.length > 300) {
            this.delegate?.publicUpdateSubmitButton(SubmitButtonStyle.Disabled)
        } else if (this.isSubmitting) {
            this.delegate?.publicUpdateSubmitButton(SubmitButtonStyle.Publishing)
        } else {
            this.delegate?.publicUpdateSubmitButton(SubmitButtonStyle.Enabled)
        }
    }
}
