import { UpdatePageViewModel, UpdatePageViewModelDelegate } from '@views/UpdatePageViewModel'
import { App, Modal, Setting } from 'obsidian'
import { Status } from '@components/Status'

/*
 * `UpdatePageView` subclasses `Model` and is presented view Obsidian's Command
 * Palette whenever the user attempts to update a page.
 *
 * The data used to populate this view and all interactions with the
 * view are handled by the view's view model. All this view does is call
 * methods on the view model and observe changes (via delegate) so it
 * can react appropriately.
 */
export class UpdatePageView extends Modal implements UpdatePageViewModelDelegate {

    // Properties

    private viewModel: UpdatePageViewModel
    private statusComponent: Status

    // Life cycle

    constructor(
        viewModel: UpdatePageViewModel,
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
        contentEl.createEl('p', { text: 'This action will replace the current live version of the page with the version from this note.' })

        new Setting(contentEl)
            .setName('Title')
            .setDesc('Title is required for pages.')
            .addText(text => text
                .setPlaceholder('Mandatory title')
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
                .setDesc('Please confirm the blog for this page.')
                .addDropdown(dropDown => dropDown
                    .addOptions(this.viewModel.blogs)
                    .setValue(this.viewModel.selectedBlogID)
                    .onChange(value => {
                        this.viewModel.selectedBlogID = value
                    })
                )
        }

        this.statusComponent = new Status(contentEl)

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Update')
                .setCta()
                .onClick(async _ => {
                    await this.viewModel.updateNote()
                })
                .then(button => {
                    if (this.viewModel.showUpdatingButton) {
                        button
                            .setDisabled(true)
                            .removeCta()
                            .setButtonText('Updating...')
                    }
                })
            )
            .setDesc(this.viewModel.missingTitleText)
    }

    public onClose() {
        super.onClose()

        const { contentEl } = this
        contentEl.empty()

        this.viewModel.delegate = undefined
    }

    // UpdatePageViewModelDelegate

    public updateDidClearTitle() {
        this.onOpen()
    }

    public updateDidSucceed() {
        const { contentEl } = this

        contentEl.empty()

        contentEl.createEl('h2', { text: 'Updated' })
        contentEl.createEl('a', { text: 'Open page URL', href: this.viewModel.url })
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

    public updateDidUpdateImageProcessingStatus(
        status: string
    ) {
        this.statusComponent.setMessage(
            status
        )
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
