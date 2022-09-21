import { App, Modal } from 'obsidian'

export class ConfirmationModal extends Modal {

    constructor(app: App) {
        super(app)
    }

    onOpen() {
        const {contentEl} = this

        contentEl.createEl('h2', {text: 'Published!'})
        contentEl.createEl('a', {text: 'Go to Posts', href: 'https://micro.blog/account/posts/'})
    }

    onClose() {
        const {contentEl} = this

        contentEl.empty()
    }
}
