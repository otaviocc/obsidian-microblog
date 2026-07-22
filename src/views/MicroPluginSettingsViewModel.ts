/*
MIT License

Copyright (c) 2022 Otavio C.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import MicroPlugin from '@base/MicroPlugin'
import { ConfigResponse } from '@networking/ConfigResponse'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { StoredSettings } from '@stores/StoredSettings'

/*
 * `MicroPluginSettingsDelegate` Interface, implemented by
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
    readonly plugin: MicroPlugin
    private settings: StoredSettings
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface

    // Life cycle

    constructor(
        plugin: MicroPlugin,
        settings: StoredSettings,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface
    ) {
        this.plugin = plugin
        this.settings = settings
        this.networkClient = networkClient
        this.networkRequestFactory = networkRequestFactory
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
    }

    public get categoriesPropertyName(): string {
        return this.settings.categoriesPropertyName
    }

    public set categoriesPropertyName(value: string) {
        this.settings.categoriesPropertyName = value
        this.plugin.saveSettings()
    }

    public get summaryPropertyName(): string {
        return this.settings.summaryPropertyName
    }

    public set summaryPropertyName(value: string) {
        this.settings.summaryPropertyName = value
        this.plugin.saveSettings()
    }

    public get tags(): string {
        return this.settings.defaultTags
    }

    public set tags(value: string) {
        this.settings.defaultTags = value
        this.plugin.saveSettings()
    }

    public set synchronizedCategories(
        value: Record<string, string[]>
    ) {
        this.settings.synchronizedCategories = value
        this.plugin.saveSettings()
    }

    public get visibility(): string {
        return this.settings.postVisibility
    }

    public set visibility(value: string) {
        this.settings.postVisibility = value
        this.plugin.saveSettings()
    }

    public get blogs(): Record<string, string> {
        return this.settings.blogs
    }

    public set blogs(value: Record<string, string>) {
        this.settings.blogs = value
        this.plugin.saveSettings()
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
    }

    public get includePagesInNavigation(): boolean {
        return this.settings.includePagesInNavigation
    }

    public set includePagesInNavigation(value: boolean) {
        this.settings.includePagesInNavigation = value
        this.plugin.saveSettings()
    }

    public get synchronizeCategoriesOnOpen(): boolean {
        return this.settings.synchronizeCategoriesOnOpen
    }

    public set synchronizeCategoriesOnOpen(value: boolean) {
        this.settings.synchronizeCategoriesOnOpen = value
        this.plugin.saveSettings()
    }

    public async validate() {
        try {
            const response = await this.networkClient.run<ConfigResponse>(
                this.networkRequestFactory.makeConfigRequest()
            )

            this.blogs = MicroPluginSettingsViewModel.makeBlogSettings(response)
            this.selectedBlogID = 'default'
            this.delegate?.loginDidSucceed(response)
        } catch (error) {
            this.logout()
            this.delegate?.loginDidFail(error)
        }
    }

    public logout() {
        this.appToken = ''
        this.blogs = {}
        this.tags = ''
        this.selectedBlogID = 'default'
        this.visibility = 'draft'
        this.synchronizedCategories = {}
        this.includePagesInNavigation = false
        this.synchronizeCategoriesOnOpen = true

        this.delegate?.logoutDidSucceed()
    }

    public async refreshBlogs() {
        try {
            const response = await this.networkClient.run<ConfigResponse>(
                this.networkRequestFactory.makeConfigRequest()
            )

            this.blogs = MicroPluginSettingsViewModel.makeBlogSettings(response)
            this.delegate?.refreshDidSucceed(response)
        } catch (error) {
            this.delegate?.refreshDidFail(error)
        }
    }
}
