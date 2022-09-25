import { Modal, Setting } from 'obsidian'
import { PublishViewModel, PublishViewModelDelegate } from '@views/PublishViewModel'
import { PublishResponse } from '@networking/PublishResponse'

export class PublishView extends Modal implements PublishViewModelDelegate {

    // Properties

    private viewModel: PublishViewModel

    // Life cycle

    constructor(viewModel: PublishViewModel) {
        super(app)

        this.viewModel = viewModel
        this.viewModel.delegate = this
    }

    // Public

    public onOpen() {
        const {contentEl} = this

        contentEl.empty()
        contentEl.createEl('h2', {text: 'Review'})

        new Setting(contentEl)
            .setName('Title')
            .setDesc('Post title is optional, but encouraged for long posts.')
            .addText(text => text
                .setPlaceholder('Optional title')
                .setValue(this.viewModel.title)
                .onChange(value => {
                    this.viewModel.title = value
                }))
            .addExtraButton(button => button
                .setIcon('cross')
                .setTooltip('Remove title')
                .onClick(() => {
                    this.viewModel.clearTitle()
                })
            )

        if (this.viewModel.hasMultipleBlogs) {
            new Setting(contentEl)
                .setName('Blog')
                .setDesc('Override the default blog for this post.')
                .addDropdown(dropDown => dropDown
                    .addOptions(this.viewModel.blogs)
                    .setValue(this.viewModel.selectedBlogID)
                    .onChange(value => {
                        this.viewModel.selectedBlogID = value
                    }))
        }

        new Setting(contentEl)
            .setName('Tags')
            .setDesc('Override the default tags for this post.')
            .addText(text => text
                .setPlaceholder('tag1, tag2, tag3')
                .setValue(this.viewModel.tags)
                .onChange(value => {
                    this.viewModel.tags = value
                }))

        new Setting(contentEl)
            .setName('Visibility')
            .setDesc('Override the default post visibility for this post.')
            .addDropdown(dropDown => dropDown
                .addOption('draft', 'Draft')
                .addOption('published', 'Public')
                .setValue(this.viewModel.visibility)
                .onChange(value => {
                    this.viewModel.visibility = value
                }))

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Publish')
                .setCta()
                .onClick(async _ => {
                    button
                        .setDisabled(true)
                        .removeCta()
                        .setButtonText('Publishing...')

                    await this.viewModel.publishNote()
                }))
    }

    public onClose() {
        const {contentEl} = this

        contentEl.empty()
    }

    // PublishViewModelDelegate

    public didClearTitle() {
        this.onOpen()
    }

    public publishDidSucceed(response: PublishResponse) {
        this.makeConfirmationView(response)
    }

    public publishDidFail(error: Error) {
        this.makeMessageView('Error', error.message)
    }

    // Private

    private makeConfirmationView(response: PublishResponse) {
        const {contentEl} = this

        contentEl.empty()

        contentEl.createEl('h2', {text: 'Published'})
        contentEl.createEl('a', {text: 'Open post URL', href: response.url})
        contentEl.createEl('br')
        contentEl.createEl('a', {text: 'Open post Preview URL', href: response.preview})
        contentEl.createEl('br')
        contentEl.createEl('a', {text: 'Open post Edit URL', href: response.edit})
    }

    private makeMessageView(
        title: string,
        message: string
    ) {
        const {contentEl} = this

        contentEl.empty()

        contentEl.createEl('h2', {text: title})
        contentEl.createEl('p', {text: message})
    }
}