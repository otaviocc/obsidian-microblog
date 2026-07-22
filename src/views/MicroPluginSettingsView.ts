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

import { ConfigResponse } from '@networking/ConfigResponse'
import { MicroPluginSettingsDelegate, MicroPluginSettingsViewModel } from '@views/MicroPluginSettingsViewModel'
import { App, Notice, PluginSettingTab, Setting } from 'obsidian'

/*
 * `MicroPluginSettingsView` subclasses `PluginSettingTab`, and is presented via
 * Obsidian's Settings Window.
 *
 * The data used to populate this view and all the interaction with the
 * view is handled by the view's view model. All this view does is to call
 * methods on the view model and observe (via delegate) changes so it
 * can react properly.
 */
export class MicroPluginSettingsView extends PluginSettingTab implements MicroPluginSettingsDelegate {

    // Properties

    private viewModel: MicroPluginSettingsViewModel

    // Life cycle

    constructor(
        viewModel: MicroPluginSettingsViewModel,
        app: App
    ) {
        super(app, viewModel.plugin)

        this.viewModel = viewModel
    }

    // Public

    public display() {
        this.viewModel.delegate = this

        if (!this.viewModel.hasAppToken) {
            this.makeLoginView()
        } else {
            this.makeSettingsView()
        }
    }

    public hide() {
        super.hide()

        this.viewModel.delegate = undefined
    }

    // MicroPluginSettingsDelegate

    public loginDidSucceed(
        _response: ConfigResponse
    ) {
        this.display()

        new Notice(
            'Micro.blog login succeeded'
        )
    }

    public loginDidFail(
        _error: Error
    ) {
        this.display()

        new Notice(
            'Micro.blog login failed'
        )
    }

    public logoutDidSucceed() {
        this.display()
    }

    public refreshDidFail(
        _error: Error
    ) {
        this.display()

        new Notice(
            'Blogs refresh failed'
        )
    }

    public refreshDidSucceed(
        _response: ConfigResponse
    ) {
        this.display()

        new Notice(
            'Blog(s) refreshed'
        )
    }

    // Private

    private makeLoginView() {
        const { containerEl } = this

        containerEl.empty()

        new Setting(containerEl)
            .setName('App Token')
            .setDesc('Visit Micro.blog\'s Account page to generate one.')
            .addText(text => text
                .setPlaceholder('Enter app token')
                .setValue(this.viewModel.appToken)
                .onChange(value => {
                    this.viewModel.appToken = value
                })
            )

        new Setting(containerEl)
            .addButton(button => button
                .setButtonText('Log in')
                .setCta()
                .onClick(async _ => {
                    button
                        .setDisabled(true)
                        .removeCta()
                        .setButtonText('Logging in...')

                    await this.viewModel.validate()
                })
            )
    }

    private makeSettingsView() {
        const { containerEl } = this

        containerEl.empty()
        containerEl.createEl('h2', { text: 'Blog' })

        new Setting(containerEl)
            .setName('Blog')
            .setDesc('Default blog for new posts and pages.')
            .addDropdown(dropDown => dropDown
                .addOptions(this.viewModel.blogs)
                .setValue(this.viewModel.selectedBlogID)
                .onChange(value => {
                    this.viewModel.selectedBlogID = value
                })
            )
            .addExtraButton(button => button
                .setIcon('sync')
                .setTooltip('Refresh blogs')
                .onClick(async () => {
                    button
                        .setDisabled(true)

                    await this.viewModel.refreshBlogs()
                })
            )

        containerEl.createEl('h2', { text: 'Posts' })

        new Setting(containerEl)
            .setName('Categories Property Name')
            .setDesc('Property name, in the frontmatter, used to store the categories of a post.')
            .addText(text => text
                .setPlaceholder('categories')
                .setValue(this.viewModel.categoriesPropertyName)
                .onChange(value => {
                    this.viewModel.categoriesPropertyName = value
                })
            )

        new Setting(containerEl)
            .setName('Summary Property Name')
            .setDesc('Property name, in the frontmatter, used to store the summary of a post or page.')
            .addText(text => text
                .setPlaceholder('summary')
                .setValue(this.viewModel.summaryPropertyName)
                .onChange(value => {
                    this.viewModel.summaryPropertyName = value
                })
            )

        new Setting(containerEl)
            .setName('Default Categories')
            .setDesc('List of categories assigned for new posts.')
            .addText(text => text
                .setPlaceholder('category1, category2, category3')
                .setValue(this.viewModel.tags)
                .onChange(value => {
                    this.viewModel.tags = value
                })
            )

        new Setting(containerEl)
            .setName('Visibility')
            .setDesc('Default visibility for new posts.')
            .addDropdown(dropDown => dropDown
                .addOption('draft', 'Draft')
                .addOption('published', 'Public')
                .setValue(this.viewModel.visibility)
                .onChange(value => {
                    this.viewModel.visibility = value
                })
            )

        containerEl.createEl('h2', { text: 'Pages' })

        new Setting(containerEl)
            .setName('Navigation')
            .setDesc('Default navigation value. Toggle on to automatically include new pages in the blog\'s navigation.')
            .addToggle(toggle => toggle
                .setValue(this.viewModel.includePagesInNavigation)
                .onChange(value => {
                    this.viewModel.includePagesInNavigation = value
                })
            )

        containerEl.createEl('h2', { text: 'Misc.' })

        new Setting(containerEl)
            .setName('Categories synchronization')
            .setDesc('Toggle on to automatically synchronize categories when Obsidian opens.')
            .addToggle(toggle => toggle
                .setValue(this.viewModel.synchronizeCategoriesOnOpen)
                .onChange(value => {
                    this.viewModel.synchronizeCategoriesOnOpen = value
                })
            )

        new Setting(containerEl)
            .addButton(button => button
                .setButtonText('Log out')
                .setCta()
                .onClick(_ => {
                    this.viewModel.logout()
                })
            )
    }
}
