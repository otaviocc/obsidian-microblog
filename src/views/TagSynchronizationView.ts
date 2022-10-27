import { Modal } from 'obsidian'
import { TagSynchronizationDelegate, TagSynchronizationViewModel } from '@views/TagSynchronizationViewModel'

/*
 * Tag Synchronization View subclasses Modal, and is presented via Obsidian's
 * Command Palette.
 *
 * The data used to populate this view and all the interaction with the
 * view is handled by the view's view model. All this view does is to call
 * methods on the view model and observe (via delegate) changes so it
 * can react properly.
 */
export class TagSynchronizationView extends Modal implements TagSynchronizationDelegate {

    // Properties

    private viewModel: TagSynchronizationViewModel

    // Life cycle

    constructor(
        viewModel: TagSynchronizationViewModel
    ) {
        super(app)

        this.viewModel = viewModel
        this.viewModel.delegate = this
    }

    // Public

    public onOpen() {
        this.makeMessageView(
            'Categories',
            'Synchronizing...'
        )

        this.viewModel.fetchTags()
    }

    public onClose() {
        super.onClose()

        const {contentEl} = this
        contentEl.empty()

        this.viewModel.delegate = undefined
    }

    // TagSynchronizationDelegate

    public tagSynchronizationDidSucceed(count: number) {
        this.makeMessageView(
            'Categories',
            'Done! Number of categories found: ' + count
        )
    }

    public tagSynchronizationDidFail(error: Error) {
        this.makeMessageView(
            'Error',
            error.message
        )
    }

    // Private

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