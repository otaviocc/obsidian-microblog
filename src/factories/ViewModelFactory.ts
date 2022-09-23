import MicroPlugin from '@base/MicroPlugin'
import { StoredSettings } from '@stores/StoredSettings'
import { MicroPluginSettingsViewModel } from '@views/MicroPluginSettingsViewModel'
import { PublishViewModel } from '@views/PublishViewModel'
import { NetworkRequestFactory } from '@networking/NetworkRequestFactory'
import { NetworkClient, NetworkClientInterface } from '@networking/NetworkClient'

export interface ViewModelFactoryInterface {
    makePublishViewModel(content: string): PublishViewModel
    makeMicroPluginSettingsViewModel(): MicroPluginSettingsViewModel
}

export class ViewModelFactory implements ViewModelFactoryInterface {

    private settings: StoredSettings
    private plugin: MicroPlugin
    private networkClient: NetworkClientInterface

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

    makePublishViewModel(content: string): PublishViewModel {
        return new PublishViewModel(
            content,
            this.settings.defaultTags,
            this.settings.postVisibility,
            this.settings.appToken.length > 0,
            this.networkClient,
            new NetworkRequestFactory()
        )
    }

    makeMicroPluginSettingsViewModel(): MicroPluginSettingsViewModel {
        return new MicroPluginSettingsViewModel(
            this.plugin,
            this.settings
        )
    }
}