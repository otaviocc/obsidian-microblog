import { PublishResponse } from '@networking/PublishResponse'
import { PublishPostViewModel, PublishPostViewModelDelegate } from '@views/PublishPostViewModel'
import { TagSuggestionView } from '@views/TagSuggestionView'
import { App, Modal, Setting } from 'obsidian'

/*
 * `PublishPostView` subclasses `Modal` and is presented via Obsidian's
 * Command Palette.
 *
 * The data used to populate this view and all interactions with the
 * view are handled by the view's view model. All this view does is call
 * methods on the view model and observe changes (via delegate) so it
 * can react appropriately.
 */
export class PublishPostView extends Modal implements PublishPostViewModelDelegate {

    // Properties

    private viewModel: PublishPostViewModel

    // Life cycle

    constructor(
        viewModel: PublishPostViewModel,
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
            .setDesc('While optional, it is encouraged to include a post title for longer posts.')
            .addText(text => text
                .setPlaceholder('Optional title')
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
                .setDesc('Override the default blog settings for this post.')
                .addDropdown(dropDown => dropDown
                    .addOptions(this.viewModel.blogs)
                    .setValue(this.viewModel.selectedBlogID)
                    .onChange(value => {
                        this.viewModel.selectedBlogID = value
                    })
                )
        }

        new Setting(contentEl)
            .setName('Categories')
            .setDesc('Override the default categories assigned to this post.')
            .addText(text => text
                .setPlaceholder('category1, category2, category3')
                .setValue(this.viewModel.tags)
                .onChange(value => {
                    this.viewModel.tags = value
                })
            )
            .addExtraButton(button => button
                .setIcon('plus')
                .setTooltip('Add categories')
                .onClick(() => {
                    new TagSuggestionView(
                        this.viewModel.suggestionsViewModel(),
                        this.app
                    ).open()
                })
            )

        new Setting(contentEl)
            .setName('Visibility')
            .setDesc('Override the default post visibility setting for this specific post.')
            .addDropdown(dropDown => dropDown
                .addOption('draft', 'Draft')
                .addOption('published', 'Public')
                .setValue(this.viewModel.visibility)
                .onChange(value => {
                    this.viewModel.visibility = value
                })
            )

        new Setting(contentEl)
            .setName('Scheduled date')
            .setDesc('The inclusion of this date is optional, and it serves the purpose of scheduling posts for future publication. If left blank, the system will default to the current date and time. Please use the following format: YYYY-MM-DD HH:MM.')
            .addText(text => text
                .setPlaceholder('YYYY-MM-DD HH:MM')
                .setValue(this.viewModel.scheduledDate)
                .onChange(value => {
                    this.viewModel.scheduledDate = value
                })
            )
            .addExtraButton(button => button
                .setIcon('cross')
                .setTooltip('Clear date')
                .onClick(() => {
                    this.viewModel.clearDate()
                })
            )

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Publish')
                .setCta()
                .onClick(async _ => {
                    await this.viewModel.publishNote()
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
            .setDesc(this.viewModel.invalidDateText)
    }

    public onClose() {
        super.onClose()

        const { contentEl } = this
        contentEl.empty()

        this.viewModel.delegate = undefined
    }

    // PublishPostViewModelDelegate

    public publishDidClearTitle() {
        this.onOpen()
    }

    public publishDidClearDate() {
        this.onOpen()
    }

    public publishDidSucceed(
        response: PublishResponse
    ) {
        this.makeConfirmationView(
            response
        )
    }

    public publishDidFail(
        error: Error
    ) {
        this.makeMessageView(
            'Error',
            error.message
        )
    }

    public publishDidSelectTag() {
        this.onOpen()
    }

    public publishDidValidateDate() {
        this.onOpen()
    }

    // Private

    private makeConfirmationView(
        response: PublishResponse
    ) {
        const { contentEl } = this

        contentEl.empty()

        contentEl.createEl('h2', { text: 'Published' })
        contentEl.createEl('a', { text: 'Open post URL', href: response.url })
        contentEl.createEl('br')
        contentEl.createEl('a', { text: 'Open post Preview URL', href: response.preview })
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
