import MicroPlugin from 'source/MicroPlugin'
import { StoredSettings } from 'source/StoredSettings'

export class MicroPluginSettingsViewModel {

    readonly plugin: MicroPlugin
    private settings: StoredSettings

    constructor(
        plugin: MicroPlugin,
        settings: StoredSettings
    ) {
        this.plugin = plugin
        this.settings = settings
    }

    get appToken(): string {
        return this.settings.appToken
    }

    get tags(): string {
        return this.settings.defaultTags
    }

    get visibility(): string {
        return this.settings.postVisibility
    }

    async setAppToken(appToken: string) {
        this.settings.appToken = appToken
        this.plugin.saveSettings()
    }

    async setTags(tags: string) {
        this.settings.defaultTags = tags
        this.plugin.saveSettings()
    }

    async setVisibility(visibility: string) {
        this.settings.postVisibility = visibility
        this.plugin.saveSettings()
    }
}