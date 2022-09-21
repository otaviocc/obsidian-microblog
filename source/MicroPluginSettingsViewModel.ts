import MicroPlugin from 'source/MicroPlugin'

export class MicroPluginSettingsViewModel {
    plugin: MicroPlugin

    constructor(plugin: MicroPlugin) {
        this.plugin = plugin
    }

    appToken(): string {
        return this.plugin.settings.appToken
    }

    async setAppToken(appToken: string) {
        this.plugin.settings.appToken = appToken
        this.plugin.saveSettings()
    }

    tags(): string {
        return this.plugin.settings.defaultTags
    }

    async setTags(tags: string) {
        this.plugin.settings.defaultTags = tags
        this.plugin.saveSettings()
    }

    visibility(): string {
        return this.plugin.settings.postVisibility
    }

    async setVisibility(visibility: string) {
        this.plugin.settings.postVisibility = visibility
        this.plugin.saveSettings()
    }
}