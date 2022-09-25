import { Plugin } from 'obsidian'
import { StoredSettings, defaultSettings } from '@stores/StoredSettings'
import { ViewModelFactoryInterface, ViewModelFactory } from '@factories/ViewModelFactory'
import { MicroPluginSettingsView } from '@views/MicroPluginSettingsView'
import { PublishView } from '@views/PublishView'

export default class MicroPlugin extends Plugin {

    private settings: StoredSettings
    private viewModelFactory: ViewModelFactoryInterface

    public async onload() {
        await this.loadSettings()
        await this.loadViewModelFactory()

        this.addCommand({
            id: 'microblog-publish-command',
            name: 'Post to Micro.blog',
            editorCallback: (editor, markdownView) => {
                new PublishView(
                    this.viewModelFactory.makePublishViewModel(
                        markdownView.file.basename,
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

    public onunload() {}

    public async saveSettings() {
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