import { Plugin } from 'obsidian'
import { StoredSettings, defaultSettings } from '@stores/StoredSettings'
import { ViewModelFactoryInterface, ViewModelFactory } from '@factories/ViewModelFactory'
import { MicroPluginSettingsView } from '@views/MicroPluginSettingsView'
import { PublishView } from '@views/PublishView'

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

    async saveSettings() {
        await this.saveData(this.settings)
    }

    private async loadSettings() {
        this.settings = Object.assign(
            {},
            defaultSettings,
            await this.loadData()
        )
    }

    private async loadViewModelFactory() {
        this.viewModelFactory = new ViewModelFactory(
            this.settings,
            this
        )
    }
}