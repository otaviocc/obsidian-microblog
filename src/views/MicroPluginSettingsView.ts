import { PluginSettingTab, Setting } from 'obsidian'
import { MicroPluginSettingsViewModel, MicroPluginSettingsDelegate} from '@views/MicroPluginSettingsViewModel'
import { ConfigResponse } from '@networking/ConfigResponse'

export class MicroPluginSettingsView extends PluginSettingTab implements MicroPluginSettingsDelegate {

    // Properties

    private viewModel: MicroPluginSettingsViewModel

    // Life cycle

    constructor(viewModel: MicroPluginSettingsViewModel) {
        super(app, viewModel.plugin)

        this.viewModel = viewModel
        this.viewModel.delegate = this
    }

    // Public

    public display(): void {
        if (!this.viewModel.hasAppToken) {
            this.makeLoginView()
        } else {
            this.makeSettingsView()
        }
    }

    // MicroPluginSettingsDelegate

    public loginDidSucceed(response: ConfigResponse) {
        this.display()
    }

    public loginDidfail(error: Error) {
        this.display()
    }

    public logoutDidSucceed() {
        this.display()   
    }

    // Private

    private makeLoginView() {
        const {containerEl} = this

        containerEl.empty()
        containerEl.createEl('h2', {text: 'Micro.blog Publish'})

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
        containerEl.createEl('h2', {text: 'Micro.blog Publish'})

        new Setting(containerEl)
            .setName('Tags')
            .setDesc('Default list of tags for new posts.')
            .addText(text => text
                .setPlaceholder('tag1, tag2, tag3')
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