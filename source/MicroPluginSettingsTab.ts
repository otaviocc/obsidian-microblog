import { App, PluginSettingTab, Setting } from 'obsidian'
import MicroPlugin from 'source/MicroPlugin'

export class MicroPluginSettingsTab extends PluginSettingTab {
    plugin: MicroPlugin

    constructor(app: App, plugin: MicroPlugin) {
        super(app, plugin)

        this.plugin = plugin
    }

    display(): void {
        const {containerEl} = this

        containerEl.empty()
        containerEl.createEl('h2', {text: 'Micro.blog Publish'})

        new Setting(containerEl)
            .setName('App Token')
            .setDesc('Visit Micro.blog\'s Account page to generate one')
            .addText(text => text
                .setPlaceholder('Enter app token')
                .setValue(this.plugin.settings.appToken)
                .onChange(async (value) => {
                    console.log('App Token: ' + value)
                    this.plugin.settings.appToken = value
                    await this.plugin.saveSettings()
                }))

        new Setting(containerEl)
            .setName('Tags')
            .setDesc('Default list of tags for new posts')
            .addText(text => text
                .setPlaceholder('tag1, tag2, tag3')
                .setValue(this.plugin.settings.defaultTags)
                .onChange(async (value) => {
                    console.log('Tags: ' + value)
                    this.plugin.settings.defaultTags = value
                    await this.plugin.saveSettings()
                }))

        new Setting(containerEl)
            .setName('Post visibility')
            .setDesc('Default visibility for new posts')
            .addDropdown(dropDown => dropDown
                .addOption('draft', 'Draft')
                .addOption('published', 'Public')
                .setValue(this.plugin.settings.postVisibility)
                .onChange(async (value) => {
                    console.log('Post Visibility: '+ value)
                    this.plugin.settings.postVisibility = value
                    await this.plugin.saveSettings()
                }))
    }
}
