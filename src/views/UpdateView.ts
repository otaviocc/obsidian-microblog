import { App, Modal, Setting } from 'obsidian'
import { UpdateViewModel, UpdateViewModelDelegate } from '@views/UpdateViewModel'

/*
 * UpdateView subclasses Model and is presented view Obsidian's Command
 * Palette whenever the user attempts to update a post.
 *
 * The data used to populate this view and all interactions with the
 * view are handled by the view's view model. All this view does is call
 * methods on the view model and observe changes (via delegate) so it
 * can react appropriately.
 */
export class UpdateView extends Modal implements UpdateViewModelDelegate {

    // Properties

    private viewModel: UpdateViewModel

    // Life cycle

    constructor(
        viewModel: UpdateViewModel,
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

        if (this.viewModel.hasMultipleBlogs) {
            new Setting(contentEl)
                .setName('Blog')
                .setDesc('Confirm the blog.')
                .addDropdown(dropDown => dropDown
                    .addOptions(this.viewModel.blogs)
                    .setValue(this.viewModel.selectedBlogID)
                    .onChange(value => {
                        this.viewModel.selectedBlogID = value
                    })
                )
        }
    }

    public onClose() {
        super.onClose()

        const { contentEl } = this
        contentEl.empty()

        this.viewModel.delegate = undefined
    }

    // Private

    private makeMessageView(
        title: string,
        message: string
    ) {
        const { contentEl } = this

        contentEl.empty()

        contentEl.createEl('h2', { text: title })
        contentEl.createEl('p', { text: message })
    }

    // UpdateViewModelDelegate

    public updateDidSucceed() {
    }

    public updateDidFail(
        error: Error
    ) {
        this.makeMessageView(
            'Error',
            error.message
        )
    }
}
