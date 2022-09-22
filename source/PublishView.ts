import { Modal, Setting } from 'obsidian'
import { PublishViewModel } from './PublishViewModel'
import { PublishResponse } from './PublishResponse'

export class PublishView extends Modal {

    private viewModel: PublishViewModel

    constructor(viewModel: PublishViewModel) {
        super(app)

        this.viewModel = viewModel
    }

    onOpen() {
        if (this.viewModel.hasAppToken) {
            this.makeReviewView()
        } else {
            this.makeMessageView(
                'Oops',
                'Missing Application Token'
            )
        }
    }

    onClose() {
        const {contentEl} = this

        contentEl.empty()
    }

    private makeReviewView() {
        const {contentEl} = this

        contentEl.empty()
        contentEl.createEl('h2', {text: 'Review'})

        new Setting(contentEl)
            .setName('Title')
            .setDesc('Post title is optional, but encouraged for long posts.')
            .addText(text => text
                .setPlaceholder('Optional title')
                .onChange(async value => {
                    this.viewModel.title = value
                }))

        new Setting(contentEl)
            .setName('Tags')
            .setDesc('Override the default tags for this post.')
            .addText(text => text
                .setPlaceholder('tag1, tag2, tag3')
                .setValue(this.viewModel.tags)
                .onChange(async value => {
                    this.viewModel.tags = value
                }))

        new Setting(contentEl)
            .setName('Visibility')
            .setDesc('Override the default post visibility for this post.')
            .addDropdown(dropDown => dropDown
                .addOption('draft', 'Draft')
                .addOption('published', 'Public')
                .setValue(this.viewModel.visibility)
                .onChange(async value => {
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

                    this.viewModel
                        .publishNote()
                        .then(response => {
                            this.makeConfirmationView(response)
                        })
                        .catch(error => {
                            this.makeMessageView(
                                'Error',
                                error.message
                            )
                        })
                }))
    }

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