import { PluginSettingTab, Setting } from 'obsidian'
import { MicroPluginSettingsViewModel, MicroPluginSettingsDelegate} from '@views/MicroPluginSettingsViewModel'
import { ConfigResponse } from '@networking/ConfigResponse'

/*
 * Plugin Settings View subclasses PluginSettingTab, and is presented via
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

    constructor(viewModel: MicroPluginSettingsViewModel) {
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

    public loginDidSucceed(response: ConfigResponse) {
        this.display()
    }

    public loginDidFail(error: Error) {
        this.display()
    }

    public logoutDidSucceed() {
        this.display()
    }

    public refreshDidFail(error: Error) {
        this.display()
    }

    public refreshDidSucceed(response: ConfigResponse) {
        this.display()
    }

    // Private

    private makeLoginView() {
        const {containerEl} = this

        containerEl.empty()
        containerEl.createEl('h2', {text: 'Micro.publish'})

        new Setting(containerEl)
            .setName('App Token')
            .setDesc('Visit Micro.blog\'s Account page to generate one.')
            .addText(text => text
                .setPlaceholder('Enter app token')
                .setValue(this.viewModel.appToken)
                .onChange(value => {
                    this.viewModel.appToken = value
                }))

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
                }))
    }

    private makeSettingsView() {
        const {containerEl} = this

        containerEl.empty()
        containerEl.createEl('h2', {text: 'Micro.publish'})

        new Setting(containerEl)
            .setName('Blog')
            .setDesc('Default blog for new posts.')
            .addDropdown(dropDown => dropDown
                .addOptions(this.viewModel.blogs)
                .setValue(this.viewModel.selectedBlogID)
                .onChange(value => {
                    this.viewModel.selectedBlogID = value
                }))
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
                }))

        new Setting(containerEl)
            .setName('Post visibility')
            .setDesc('Default visibility for new posts.')
            .addDropdown(dropDown => dropDown
                .addOption('draft', 'Draft')
                .addOption('published', 'Public')
                .setValue(this.viewModel.visibility)
                .onChange(value => {
                    this.viewModel.visibility = value
                }))

        new Setting(containerEl)
            .addButton(button => button
                .setButtonText('Log out')
                .setCta()
                .onClick(_ => {
                    this.viewModel.logout()
                }))
    }
}