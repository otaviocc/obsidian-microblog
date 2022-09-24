import MicroPlugin from '@base/MicroPlugin'
import { NetworkRequestFactory } from '@networking/NetworkRequestFactory'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { StoredSettings } from '@stores/StoredSettings'
import { ConfigResponse } from '@networking/ConfigResponse'

export interface MicroPluginSettingsDelegate {
    loginDidFail(error: Error): void
    loginDidSucceed(response: ConfigResponse): void
    logoutDidSucceed(): void
}

export class MicroPluginSettingsViewModel {

    // Properties

    public delegate?: MicroPluginSettingsDelegate
    private settings: StoredSettings
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactory
    readonly plugin: MicroPlugin

    // Life cycle

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

    // Public

    public get hasAppToken(): boolean {
        return this.settings.appToken.length > 0
    }

    public get appToken(): string {
        return this.settings.appToken
    }

    public set appToken(value: string) {
        this.settings.appToken = value
        this.plugin.saveSettings()
        console.log("Token changed: " + value)
    }

    public get tags(): string {
        return this.settings.defaultTags
    }

    public set tags(value: string) {
        this.settings.defaultTags = value
        this.plugin.saveSettings()
        console.log("Default tags changed: " + value)
    }

    public get visibility(): string {
        return this.settings.postVisibility
    }

    public set visibility(value: string) {
        this.settings.postVisibility = value
        this.plugin.saveSettings()
        console.log("Default visibility changed: " + value)
    }

    public async validate() {
        await this.networkClient
            .run<ConfigResponse>(
                this.networkRequestFactory.makeConfigRequest()
            )
            .then(value => {
                this.delegate?.loginDidSucceed(value)
                console.log("Login successful")
            })
            .catch(error => {
                this.appToken = ""
                this.delegate?.loginDidFail(error)
                console.log("Login error: " + error)
            })
    }

    public logout() {
        this.appToken = ""
        this.delegate?.logoutDidSucceed()
        console.log("Logout successful")
    }
}