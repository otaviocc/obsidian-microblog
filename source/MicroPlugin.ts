import { Plugin } from 'obsidian'
import { StoredSettings, defaultSettings } from 'source/StoredSettings'
import { MicroPluginSettingsView } from 'source/MicroPluginSettingsView'
import { PublishView } from 'source/PublishView'
import { ViewModelFactoryInterface, ViewModelFactory } from 'source/ViewModelFactory'

export default class MicroPlugin extends Plugin {

    private settings: StoredSettings
    private viewModelFactory: ViewModelFactoryInterface

    async onload() {
        await this.loadSettings()
        await this.loadViewModelFactory()

        this.addCommand({
            id: 'microblog-publish-command',
            name: 'Post to Micro.blog',
            editorCallback: (editor, _) => {
                new PublishView(
                    this.viewModelFactory.makePublishViewModel(
                        editor.getValue()
                    )
                ).open()
            }
        })

        this.addSettingTab(
            new MicroPluginSettingsView(
                this.viewModelFactory.makeMicroPluginSettingsViewModel()
            )
        )
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign(
            {},
            defaultSettings,
            await this.loadData()
        )
    }

    async loadViewModelFactory() {
        this.viewModelFactory = new ViewModelFactory(
            this.settings,
            this
        )
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }
}