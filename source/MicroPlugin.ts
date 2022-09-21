import { Plugin } from 'obsidian'
import { StoredSettings, defaultSettings } from 'source/StoredSettings'
import { MicroPluginSettingsView } from 'source/MicroPluginSettingsView'
import { MicroPluginSettingsViewModel } from 'source/MicroPluginSettingsViewModel'
import { PublishView } from 'source/PublishView'
import { PublishViewModel } from 'source/PublishViewModel'

export default class MicroPlugin extends Plugin {

    settings: StoredSettings

    async onload() {
        await this.loadSettings()

        this.addCommand({
            id: 'microblog-publish-command',
            name: 'Post to Micro.blog',
            editorCallback: (editor, _) => {
                new PublishView(
                    new PublishViewModel(editor.getValue(), this.settings)
                ).open()
            }
        })

        this.addSettingTab(
            new MicroPluginSettingsView(
                new MicroPluginSettingsViewModel(this)
            )
        )
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign({}, defaultSettings, await this.loadData())
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }
}