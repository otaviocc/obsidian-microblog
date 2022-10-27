import { Plugin } from 'obsidian'
import { StoredSettings, defaultSettings } from '@stores/StoredSettings'
import { ViewModelFactoryInterface, ViewModelFactory } from '@factories/ViewModelFactory'
import { MicroPluginSettingsView } from '@views/MicroPluginSettingsView'
import { PublishView } from '@views/PublishView'
import { TagSynchronizationView } from '@views/TagSynchronizationView'

export default class MicroPlugin extends Plugin {

    // Properties

    private settings: StoredSettings
    private viewModelFactory: ViewModelFactoryInterface

    // Public

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

        this.addCommand({
            id: 'microblog-categories-sync-command',
            name: 'Synchronize Categories',
            callback: () => {
                new TagSynchronizationView(
                    this.viewModelFactory.makeTagSynchronizationViewModel()
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

    // Private

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