import { MicroPluginContainer, MicroPluginContainerInterface } from '@base/MicroPluginContainer'
import { isMarkdownView, isPublishPageViewModel, isPublishPostViewModel, isUpdatePageViewModel, isUpdatePostViewModel } from '@extensions/TypeGuards'
import { ServiceFactory, ServiceFactoryInterface } from '@factories/ServiceFactory'
import { ViewModelFactory, ViewModelFactoryInterface } from '@factories/ViewModelFactory'
import { TagSynchronizationServiceInterface } from '@services/TagSynchronizationService'
import { StoredSettings, defaultSettings } from '@stores/StoredSettings'
import { ComposeView } from '@views/ComposeView'
import { ErrorView } from '@views/ErrorView'
import { MicroPluginSettingsView } from '@views/MicroPluginSettingsView'
import { PublishPageView } from '@views/PublishPageView'
import { PublishPostView } from '@views/PublishPostView'
import { UpdatePageView } from '@views/UpdatePageView'
import { UpdatePostView } from '@views/UpdatePostView'
import { Notice, Plugin } from 'obsidian'

export default class MicroPlugin extends Plugin {

    // Properties

    private settings: StoredSettings
    private container: MicroPluginContainerInterface
    private viewModelFactory: ViewModelFactoryInterface
    private serviceFactory: ServiceFactoryInterface
    private synchronizationService: TagSynchronizationServiceInterface

    // Public

    public async onload() {
        await this.loadSettings()
        await this.loadDependencies()
        await this.loadViewModelFactory()
        await this.loadServiceFactory()
        await this.registerSynchronizationService()

        this.synchronizationService.fetchTags()

        this.addCommand({
            id: 'microblog-publish-post-command',
            name: 'Publish Post to Micro.blog',
            editorCallback: (editor, markdownView) => {
                if (editor.getValue().trim().length == 0) {
                    new ErrorView(
                        this.viewModelFactory.makeEmptyPostErrorViewModel(),
                        this.app
                    ).open()
                } else if (isMarkdownView(markdownView)) {
                    const viewModel = this.viewModelFactory.makeSubmitPostViewModel(
                        markdownView
                    )

                    if (isPublishPostViewModel(viewModel)) {
                        new PublishPostView(viewModel, this.app)
                            .open()
                    }

                    if (isUpdatePostViewModel(viewModel)) {
                        new UpdatePostView(viewModel, this.app)
                            .open()
                    }
                }
            }
        })

        this.addCommand({
            id: 'microblog-publish-page-command',
            name: 'Publish Page to Micro.blog',
            editorCallback: (editor, markdownView) => {
                if (editor.getValue().trim().length == 0) {
                    new ErrorView(
                        this.viewModelFactory.makeEmptyPageErrorViewModel(),
                        this.app
                    ).open()
                } else if (isMarkdownView(markdownView)) {
                    const viewModel = this.viewModelFactory.makeSubmitPageViewModel(
                        markdownView
                    )

                    if (isPublishPageViewModel(viewModel)) {
                        new PublishPageView(viewModel, this.app)
                            .open()
                    }

                    if (isUpdatePageViewModel(viewModel)) {
                        new UpdatePageView(viewModel, this.app)
                            .open()
                    }
                }
            }
        })

        this.addCommand({
            id: 'microblog-publish-compose-micropost',
            name: 'Compose Micropost',
            callback: () => {
                this.openComposeMicropostView()
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
                this.viewModelFactory.makeMicroPluginSettingsViewModel(),
                this.app
            )
        )

        this.addRibbonIcon(
            "message-circle",
            "Compose Micropost",
            () => {
                this.openComposeMicropostView()
            }
        )
    }

    public onunload() { }

    public async saveSettings() {
        await this.saveData(this.settings)
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
        _error: Error
    ) {
        new Notice(
            'Error synchronizing categories'
        )
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
        this.serviceFactory = new ServiceFactory(
            this.container
        )
    }

    private async registerSynchronizationService() {
        this.synchronizationService = this.serviceFactory
            .makeTagSynchronizationService(
                this
            )
    }

    private openComposeMicropostView() {
        const viewModel = this.viewModelFactory.makeComposeViewModel()

        new ComposeView(
            viewModel,
            this.app
        ).open()
    }
}
