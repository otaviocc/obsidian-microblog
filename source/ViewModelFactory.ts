import { StoredSettings } from 'source/StoredSettings'
import { MicroPluginSettingsViewModel } from 'source/MicroPluginSettingsViewModel'
import { PublishViewModel } from 'source/PublishViewModel'
import { NetworkRequestFactory } from 'source/NetworkRequest.Publish'
import { NetworkClient } from  'source/NetworkClient'
import MicroPlugin from 'source/MicroPlugin'

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
        return new PublishViewModel(
            content,
            this.settings,
            new NetworkClient(this.settings),
            new NetworkRequestFactory()
        )
    }

    makeMicroPluginSettingsViewModel(): MicroPluginSettingsViewModel {
        return new MicroPluginSettingsViewModel(this.plugin)
    }
}