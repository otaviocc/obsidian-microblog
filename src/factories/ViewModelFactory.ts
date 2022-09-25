import MicroPlugin from '@base/MicroPlugin'
import { StoredSettings } from '@stores/StoredSettings'
import { MicroPluginSettingsViewModel } from '@views/MicroPluginSettingsViewModel'
import { PublishViewModel } from '@views/PublishViewModel'
import { NetworkRequestFactory } from '@networking/NetworkRequestFactory'
import { NetworkClient, NetworkClientInterface } from '@networking/NetworkClient'

export interface ViewModelFactoryInterface {
    makePublishViewModel(title: string, content: string): PublishViewModel
    makeMicroPluginSettingsViewModel(): MicroPluginSettingsViewModel
}

export class ViewModelFactory implements ViewModelFactoryInterface {

    // Properties

    private settings: StoredSettings
    private plugin: MicroPlugin
    private networkClient: NetworkClientInterface

    // Life cycle

    constructor(
        settings: StoredSettings,
        plugin: MicroPlugin
    ) {
        this.settings = settings
        this.plugin = plugin
        this.networkClient = new NetworkClient(() => {
            return this.settings.appToken
        })
    }

    // Public

    public makePublishViewModel(
        title: string,
        content: string
    ): PublishViewModel {
        return new PublishViewModel(
            title,
            content,
            this.settings.defaultTags,
            this.settings.postVisibility,
            this.settings.blogs,
            this.settings.selectedBlogID,
            this.networkClient,
            new NetworkRequestFactory()
        )
    }

    public makeMicroPluginSettingsViewModel(): MicroPluginSettingsViewModel {
        return new MicroPluginSettingsViewModel(
            this.plugin,
            this.settings,
            this.networkClient,
            new NetworkRequestFactory()
        )
    }
}