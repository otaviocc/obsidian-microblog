/*
MIT License

Copyright (c) 2022 Otavio C.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

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

        new Setting(contentEl)
            .setName('Summary')
            .setDesc('Confirm the summary assigned to this page.')
            .addTextArea(textArea => {
                textArea
                    .setPlaceholder('Optional summary')
                    .setValue(this.viewModel.summary)
                    .onChange(value => {
                        this.viewModel.summary = value
                    })

                textArea.inputEl.style.minHeight = '90px'
                textArea.inputEl.style.width = '100%'
            })

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
