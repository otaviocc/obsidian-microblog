import { Modal, Setting } from 'obsidian'
import { PublishViewModel } from 'source/PublishViewModel'

export class PublishView extends Modal {
    viewModel: PublishViewModel

    constructor(viewModel: PublishViewModel) {
        super(app)

        this.viewModel = viewModel
    }

    onOpen() {
        const {contentEl} = this

        contentEl.createEl('h2', {text: 'Review'})

        new Setting(contentEl)
            .setName('Title')
            .setDesc('Post title is option, but encouraged for long posts')
            .addText(text => text
                .setPlaceholder('Title')
                .onChange(async value => {
                    this.viewModel.title = value
                    console.log('Post title: ' + value)
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
                    console.log('Post Visibility: '+ value)
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
                    console.log("Published")

                    this.close()
                }))
    }

    onClose() {
        const {contentEl} = this

        contentEl.empty()
    }
}