import MicroPlugin from './MicroPlugin'
import { StoredSettings } from './StoredSettings'
import { MicroPluginSettingsViewModel } from './MicroPluginSettingsViewModel'
import { PublishViewModel } from './PublishViewModel'
import { NetworkRequestFactory } from './NetworkRequestFactory'
import { NetworkClient } from  'source/NetworkClient'

export interface ViewModelFactoryInterface {
    makePublishViewModel(content: string): PublishViewModel
    makeMicroPluginSettingsViewModel(): MicroPluginSettingsViewModel
}

export class ViewModelFactory implements ViewModelFactoryInterface {

    private settings: StoredSettings
    private plugin: MicroPlugin

    constructor(
        settings: StoredSettings,
        plugin: MicroPlugin
    ) {
        this.settings = settings
        this.plugin = plugin
    }

    makePublishViewModel(content: string): PublishViewModel {
        const networkClient = new NetworkClient(() => {
            return this.settings.appToken
        })

        return new PublishViewModel(
            content,
            this.settings.defaultTags,
            this.settings.postVisibility,
            this.settings.appToken.length > 0,
            networkClient,
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