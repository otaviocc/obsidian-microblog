import MicroPlugin from './MicroPlugin'
import { StoredSettings } from './StoredSettings'

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
}