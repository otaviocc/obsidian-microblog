import { Modal, Setting } from 'obsidian'
import { PublishViewModel } from './PublishViewModel'
import { PublishResponse } from './NetworkRequest.Publish'

export class PublishView extends Modal {

    private viewModel: PublishViewModel

    constructor(viewModel: PublishViewModel) {
        super(app)

        this.viewModel = viewModel
    }

    onOpen() {
        this.makeReviewView()
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
            .setDesc('Post title is option, but encouraged for long posts')
            .addText(text => text
                .setPlaceholder('Title')
                .onChange(async value => {
                    this.viewModel.title = value
                }))

        new Setting(contentEl)
            .setName('Visibility')
            .setDesc('Override the default post visibility for this post')
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
                            this.makeErrorView(error)
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

    private makeErrorView(error: Error) {
        const {contentEl} = this

        contentEl.empty()

        contentEl.createEl('h2', {text: 'Oops'})
        contentEl.createEl('p', {text: 'Error: ' + error.message})
    }
}