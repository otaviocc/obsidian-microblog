import { UpdatePostViewModel, UpdatePostViewModelDelegate } from '@views/UpdatePostViewModel'
import { App, Modal, Setting } from 'obsidian'

/*
 * `UpdatePostView` subclasses `Model` and is presented view Obsidian's Command
 * Palette whenever the user attempts to update a post.
 *
 * The data used to populate this view and all interactions with the
 * view are handled by the view's view model. All this view does is call
 * methods on the view model and observe changes (via delegate) so it
 * can react appropriately.
 */
export class UpdatePostView extends Modal implements UpdatePostViewModelDelegate {

    // Properties

    private viewModel: UpdatePostViewModel

    // Life cycle

    constructor(
        viewModel: UpdatePostViewModel,
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
                .setDesc('Please confirm the blog for this post.')
                .addDropdown(dropDown => dropDown
                    .addOptions(this.viewModel.blogs)
                    .setValue(this.viewModel.selectedBlogID)
                    .onChange(value => {
                        this.viewModel.selectedBlogID = value
                    })
                )
        }

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Update')
                .setCta()
                .onClick(async _ => {
                    await this.viewModel.updateNote()
                })
                .then(_ => {
                    if (this.viewModel.showUpdatingButton) {
                        button
                            .setDisabled(true)
                            .removeCta()
                            .setButtonText('Updating...')
                    }
                })
            )
    }

    public onClose() {
        super.onClose()

        const { contentEl } = this
        contentEl.empty()

        this.viewModel.delegate = undefined
    }

    // UpdatePostViewModelDelegate

    public updateDidClearTitle() {
        this.onOpen()
    }

    public updateDidSucceed() {
        const { contentEl } = this

        contentEl.empty()

        contentEl.createEl('h2', { text: 'Updated' })
        contentEl.createEl('a', { text: 'Open post URL', href: this.viewModel.url })
    }

    public updateDidFail(
        error: Error
    ) {
        this.makeMessageView(
            'Error',
            error.message
        )
    }

    public updateRequestDidStart() {
        this.onOpen()
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
}
