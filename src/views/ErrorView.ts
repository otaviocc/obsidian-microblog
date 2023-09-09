import { App, Modal } from 'obsidian'
import { ErrorViewModel } from '@views/ErrorViewModel'

/*
 * `ErrorView` subclasses `Modal`.
 */
export class ErrorView extends Modal {

    // Properties

    private viewModel: ErrorViewModel

    // Life cycle

    constructor(
        viewModel: ErrorViewModel,
        app: App
    ) {
        super(app)

        this.viewModel = viewModel
    }

    // Public

    public onOpen() {
        super.onOpen()

        const { contentEl } = this

        contentEl.empty()
        contentEl.createEl('h2', { text: this.viewModel.title })
        contentEl.createEl('p', { text: this.viewModel.message })
    }

    public onClose() {
        super.onClose()

        const { contentEl } = this

        contentEl.empty()
    }
}
