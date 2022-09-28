import MicroPlugin from '@base/MicroPlugin'
import { NetworkRequestFactory } from '@networking/NetworkRequestFactory'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { StoredSettings } from '@stores/StoredSettings'
import { ConfigResponse } from '@networking/ConfigResponse'

/*
 * Plugin Settings View Delegate Interface, implemented by
 * the object which needs to observe events from the view model.
 */
export interface MicroPluginSettingsDelegate {

    // Triggered when login fails.
    loginDidFail(error: Error): void

    // Triggered when the login succeeds.
    loginDidSucceed(response: ConfigResponse): void

    // Triggered logout succeeds.
    logoutDidSucceed(): void

    // Triggered when refreshing list of blogs fails.
    refreshDidFail(error: Error): void

    // Triggered when refreshing list of blogs succeeds.
    refreshDidSucceed(response: ConfigResponse): void
}

/*
 * This view model drives the content and interactions with the
 * plugin settings view.
 */
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
        console.log('Token changed: ' + value)
    }

    public get tags(): string {
        return this.settings.defaultTags
    }

    public set tags(value: string) {
        this.settings.defaultTags = value
        this.plugin.saveSettings()
        console.log('Default tags changed: ' + value)
    }

    public get visibility(): string {
        return this.settings.postVisibility
    }

    public set visibility(value: string) {
        this.settings.postVisibility = value
        this.plugin.saveSettings()
        console.log('Default visibility changed: ' + value)
    }

    public get blogs(): Record<string, string> {
        return this.settings.blogs
    }

    public set blogs(value: Record<string, string>) {
        this.settings.blogs = value
        this.plugin.saveSettings()
        console.log('Default blogs changed: ' + JSON.stringify(this.blogs))
    }

    public get hasMultipleBlogs(): boolean {
        return Object.keys(this.blogs).length > 2
    }

    public get selectedBlogID(): string {
        return this.settings.selectedBlogID
    }

    public set selectedBlogID(value: string) {
        this.settings.selectedBlogID = value
        this.plugin.saveSettings()
        console.log('Default selected blog ID changed: ' + value)
    }

    public async validate() {
        await this.networkClient
            .run<ConfigResponse>(
                this.networkRequestFactory.makeConfigRequest()
            )
            .then(value => {
                this.blogs = MicroPluginSettingsViewModel.makeBlogSettings(value)
                this.selectedBlogID = 'default'
                this.delegate?.loginDidSucceed(value)
                console.log('Login successful')
            })
            .catch(error => {
                this.logout()
                this.delegate?.loginDidFail(error)
                console.log('Login error: ' + error)
            })
    }

    public logout() {
        this.appToken = ''
        this.blogs = {}
        this.tags = ''
        this.selectedBlogID = 'default'
        this.visibility = 'draft'
        this.delegate?.logoutDidSucceed()
        console.log('Logout successful')
    }

    public async refreshBlogs() {
        await this.networkClient
            .run<ConfigResponse>(
                this.networkRequestFactory.makeConfigRequest()
            )
            .then(value => {
                this.blogs = MicroPluginSettingsViewModel.makeBlogSettings(value)
                this.delegate?.refreshDidSucceed(value)
                console.log('Refresh successful')
            })
            .catch(error => {
                this.delegate?.refreshDidFail(error)
                console.log('Refresh failed: ' + error)
            })
    }

    // Private

    private static makeBlogSettings(
        response: ConfigResponse
    ): { [uid: string]: string } {
        const blogs: { [uid: string]: string } = {}

        blogs['default'] = 'Default'

        response.destination?.forEach(blog => {
            blogs[blog.uid] = blog.name
        })

        return blogs
    }
}