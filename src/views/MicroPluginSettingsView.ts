import { PluginSettingTab, Setting } from 'obsidian'
import { MicroPluginSettingsViewModel } from '@views/MicroPluginSettingsViewModel'

export class MicroPluginSettingsView extends PluginSettingTab {

    private viewModel: MicroPluginSettingsViewModel

    constructor(viewModel: MicroPluginSettingsViewModel) {
        super(app, viewModel.plugin)

        this.viewModel = viewModel
    }

    display(): void {
        if (!this.viewModel.hasAppToken) {
            this.makeLoginView()
        } else {
            this.makeSettingsView()
        }
    }

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
                .onClick(_ => {
                    button
                        .setDisabled(true)
                        .removeCta()
                        .setButtonText('Logging in...')

                    this.viewModel
                        .validate()
                        .then(response => {
                            this.display()
                        })
                        .catch(error => {
                            console.log("error: " + error)
                            this.viewModel.appToken = ""
                            this.display()
                        })
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
                    this.viewModel.appToken = ""
                    this.display()
                }))
    }
}