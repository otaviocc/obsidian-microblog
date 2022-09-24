import MicroPlugin from '@base/MicroPlugin'
import { NetworkRequestFactory } from '@networking/NetworkRequestFactory'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { StoredSettings } from '@stores/StoredSettings'
import { ConfigResponse } from '@networking/ConfigResponse'

export class MicroPluginSettingsViewModel {

    readonly plugin: MicroPlugin
    private settings: StoredSettings
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactory

    constructor(
        plugin: MicroPlugin,
        settings: StoredSettings,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactory
    ) {
        this.plugin = plugin
        this.settings = settings
        this.networkClient = networkClient
        this.networkRequestFactory = networkRequestFactory
    }

    get hasAppToken(): boolean {
        return this.settings.appToken.length > 0
    }

    get appToken(): string {
        return this.settings.appToken
    }

    set appToken(value: string) {
        this.settings.appToken = value
        this.plugin.saveSettings()
        console.log("Token changed: " + value)
    }

    get tags(): string {
        return this.settings.defaultTags
    }

    set tags(value: string) {
        this.settings.defaultTags = value
        this.plugin.saveSettings()
        console.log("Default tags changed: " + value)
    }

    get visibility(): string {
        return this.settings.postVisibility
    }

    set visibility(value: string) {
        this.settings.postVisibility = value
        this.plugin.saveSettings()
        console.log("Default visibility changed: " + value)
    }

    async validate(): Promise<ConfigResponse> {
        return this.networkClient.run<ConfigResponse>(
            this.networkRequestFactory.makeConfigRequest()
        )
    }
}