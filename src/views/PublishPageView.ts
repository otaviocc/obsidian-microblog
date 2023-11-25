import { PublishResponse } from "@networking/PublishResponse"
import { PublishPageViewModel, PublishPageViewModelDelegate } from "@views/PublishPageViewModel"
import { App, Modal, Setting } from "obsidian"

/*
 * `PublishPageView` subclasses `Modal` and is presented via Obsidian's
 * Command Palette.
 *
 * The data used to populate this view and all interactions with the
 * view are handled by the view's view model. All this view does is call
 * methods on the view model and observe changes (via delegate) so it
 * can react appropriately.
 */
export class PublishPageView extends Modal implements PublishPageViewModelDelegate {

    // Properties

    private viewModel: PublishPageViewModel

    // Life cycle

    constructor(
        viewModel: PublishPageViewModel,
        app: App
    ) {
        super(app)

        this.viewModel = viewModel
        this.viewModel.delegate = this
    }

    // Public

    public onOpen() {
        super.onOpen()

        const { contentEl } = this

        contentEl.empty()
        contentEl.createEl('h2', { text: 'Review' })

        new Setting(contentEl)
            .setName('Title')
            .setDesc('Title is required for pages.')
            .addText(text => text
                .setPlaceholder('Mandatory title')
                .setValue(this.viewModel.title)
                .onChange(value => {
                    this.viewModel.title = value
                })
            )
            .addExtraButton(button => button
                .setIcon('cross')
                .setTooltip('Clear title')
                .onClick(() => {
                    this.viewModel.clearTitle()
                })
            )

        if (this.viewModel.hasMultipleBlogs) {
            new Setting(contentEl)
                .setName('Blog')
                .setDesc('Override the default blog settings for this page.')
                .addDropdown(dropDown => dropDown
                    .addOptions(this.viewModel.blogs)
                    .setValue(this.viewModel.selectedBlogID)
                    .onChange(value => {
                        this.viewModel.selectedBlogID = value
                    })
                )
        }

        new Setting(contentEl)
            .setName('Navigation')
            .setDesc('Override the default setting. Toggle on to automatically include this page in the blog\'s navigation.')
            .addToggle(toggle => toggle
                .setValue(this.viewModel.includeInNavigation)
                .onChange(value => {
                    this.viewModel.includeInNavigation = value
                })
            )

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Publish')
                .setCta()
                .onClick(async _ => {
                    await this.viewModel.publishPage()
                })
                .then(button => {
                    if (this.viewModel.showPublishingButton) {
                        button
                            .setDisabled(true)
                            .removeCta()
                            .setButtonText('Publishing...')
                    }
                })
            )
            .setDesc(this.viewModel.missingTitleText)
    }

    // PublishPageViewModelDelegate

    public publishDidClearTitle() {
        this.onOpen()
    }

    public publishDidSucceed(
        response: PublishResponse
    ) {
        this.makeConfirmationView(
            response
        )
    }

    public publishDidFail(error: Error) {
        this.makeMessageView(
            'Error',
            error.message
        )
    }

    public publishDidValidateTitle() {
        this.onOpen()
    }

    // Private

    private makeConfirmationView(
        response: PublishResponse
    ) {
        const { contentEl } = this

        contentEl.empty()

        contentEl.createEl('h2', { text: 'Published' })
        contentEl.createEl('a', { text: 'Open page URL', href: response.url })
        contentEl.createEl('br')
        contentEl.createEl('a', { text: 'Open page Preview URL', href: response.preview })
    }

    private makeMessageView(
        title: string,
        message: string
    ) {
        const { contentEl } = this

        contentEl.empty()

        contentEl.createEl('h2', { text: title })
        contentEl.createEl('p', { text: message })
    }
}
