import MicroPlugin from 'source/MicroPlugin'

export class MicroPluginSettingsViewModel {

    plugin: MicroPlugin

    constructor(plugin: MicroPlugin) {
        this.plugin = plugin
    }

    get appToken(): string {
        return this.plugin.settings.appToken
    }

    get tags(): string {
        return this.plugin.settings.defaultTags
    }

    get visibility(): string {
        return this.plugin.settings.postVisibility
    }

    async setAppToken(appToken: string) {
        this.plugin.settings.appToken = appToken
        this.plugin.saveSettings()
    }

    async setTags(tags: string) {
        this.plugin.settings.defaultTags = tags
        this.plugin.saveSettings()
    }

    async setVisibility(visibility: string) {
        this.plugin.settings.postVisibility = visibility
        this.plugin.saveSettings()
    }
}