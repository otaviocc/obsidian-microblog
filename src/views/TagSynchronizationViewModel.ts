import MicroPlugin from '@base/MicroPlugin'
import { CategoriesResponse } from '@networking/CategoriesResponse'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { StoredSettings } from '@stores/StoredSettings'

/*
 * Tag Synchronization Delegate Interface, implemented by
 * the object which needs to observe events from the view model.
 */
export interface TagSynchronizationDelegate {

    // Triggered when tag synchronization succeeds.
    tagSynchronizationDidSucceed(count: number): void

    // Triggered when tag synchronization fails.
    tagSynchronizationDidFail(error: Error): void
}

/*
 * This view model drives the content and interactions with the
 * tag synchronization view.
 */
export class TagSynchronizationViewModel {

    // Properties

    public delegate?: TagSynchronizationDelegate
    private settings: StoredSettings
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface
    private plugin: MicroPlugin

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

    // Public

    public async fetchTags() {
        try {
            const response = await this.networkClient.run<CategoriesResponse>(
                this.networkRequestFactory.makeCategoriesRequest()
            )

            this.settings.tags = response.categories
            this.plugin.saveSettings()

            this.delegate?.tagSynchronizationDidSucceed(response.categories.length)
            console.log('Categories synchronized: ' + response.categories)
        } catch (error) {
            this.delegate?.tagSynchronizationDidFail(error)
            console.log('Categories synchronization error: ' + error)
        }
    }
}