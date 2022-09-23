import { PluginSettingTab, Setting } from 'obsidian'
import { MicroPluginSettingsViewModel } from '@views/MicroPluginSettingsViewModel'

export class MicroPluginSettingsView extends PluginSettingTab {

    private viewModel: MicroPluginSettingsViewModel

    constructor(viewModel: MicroPluginSettingsViewModel) {
        super(app, viewModel.plugin)

        this.viewModel = viewModel
    }

    display(): void {
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
    }
}