import { Notice, Plugin } from 'obsidian'
import { StoredSettings, defaultSettings } from '@stores/StoredSettings'
import { ViewModelFactoryInterface, ViewModelFactory } from '@factories/ViewModelFactory'
import { MicroPluginSettingsView } from '@views/MicroPluginSettingsView'
import { PublishView } from '@views/PublishView'
import { MicroPluginContainerInterface, MicroPluginContainer } from '@base/MicroPluginContainer'
import { TagSynchronizationService, TagSynchronizationServiceInterface } from '@services/TagSynchronizationService'

export default class MicroPlugin extends Plugin {

    // Properties

    private settings: StoredSettings
    private container: MicroPluginContainerInterface
    private viewModelFactory: ViewModelFactoryInterface
    private synchronizationService: TagSynchronizationServiceInterface

    // Public

    public async onload() {
        await this.loadSettings()
        await this.loadDependencies()
        await this.loadViewModelFactory()
        await this.loadServiceFactory()

        this.synchronizationService.fetchTags()

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
                this.synchronizationService.fetchTags()
            }
        })

        this.addSettingTab(
            new MicroPluginSettingsView(
                this.viewModelFactory.makeMicroPluginSettingsViewModel()
            )
        )
    }

    public onunload() { }

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

    private async loadDependencies() {
        this.container = new MicroPluginContainer(
            this.settings,
            this
        )
    }

    private async loadViewModelFactory() {
        this.viewModelFactory = new ViewModelFactory(
            this.container
        )
    }

    private async loadServiceFactory() {
        this.synchronizationService = new TagSynchronizationService(
            this.container
        )
        this.synchronizationService.delegate = this
    }

    // TagSynchronizationServiceDelegate

    public tagSynchronizationDidSucceed(
        count: number
    ) {
        new Notice(
            'Categories synchronized. Found ' + count + ' categories'
        )
    }

    public tagSynchronizationDidFail(
        error: Error
    ) {
        new Notice(
            'Error synchronizing categories'
        )
    }
}