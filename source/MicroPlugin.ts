import { Editor, MarkdownView, Plugin } from 'obsidian'
import { ConfirmationModal } from 'source/ConfirmationModal'
import { NetworkClient } from 'source/NetworkClient'
import { makePublishRequest, PublishResponse } from 'source/NetworkRequest.Publish'
import { StoredSettings, defaultSettings } from 'source/StoredSettings'
import { MicroPluginSettingsTab } from 'source/MicroPluginSettingsTab'

export default class MicroPlugin extends Plugin {
    settings: StoredSettings
    networkClient: NetworkClient

    async onload() {
        await this.loadSettings()
        await this.loadNetworkClient()

        this.addCommand({
            id: 'microblog-publish-command',
            name: 'Post to Micro.blog',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const request = makePublishRequest(editor.getValue(), this.settings.postVisibility)
                this.networkClient.run<PublishResponse>(request)
                new ConfirmationModal(this.app).open();
            }
        })

        this.addSettingTab(new MicroPluginSettingsTab(this.app, this))
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign({}, defaultSettings, await this.loadData())
    }

    async loadNetworkClient() {
        this.networkClient = new NetworkClient(this.settings)
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }
}
