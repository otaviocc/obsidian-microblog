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
        containerEl.createEl('h2', { text: 'Micro.publish' })

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
        containerEl.createEl('h2', { text: 'Micro.publish' })

        new Setting(containerEl)
            .setName('Blog')
            .setDesc('Default blog for new posts.')
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

        new Setting(containerEl)
            .setName('Categories')
            .setDesc('Default list of categories for new posts.')
            .addText(text => text
                .setPlaceholder('category1, category2, category3')
                .setValue(this.viewModel.tags)
                .onChange(value => {
                    this.viewModel.tags = value
                })
            )

        new Setting(containerEl)
            .setName('Post visibility')
            .setDesc('Default visibility for new posts.')
            .addDropdown(dropDown => dropDown
                .addOption('draft', 'Draft')
                .addOption('published', 'Public')
                .setValue(this.viewModel.visibility)
                .onChange(value => {
                    this.viewModel.visibility = value
                })
            )

        new Setting(this.containerEl)
            .setName('Sponsor')
            .setDesc('Enjoying this plugin? Show your appreciation with a cup of coffee! 😊☕')
            .addButton(button =>
                button.buttonEl.outerHTML = '<a href="https://ko-fi.com/Z8Z0C9KPT" target="_blank"><img height="36" style="border:0px;height:36px;" src="https://storage.ko-fi.com/cdn/kofi3.png?v=3" border="0" alt="Buy Me a Coffee at ko-fi.com" /></a>'
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
