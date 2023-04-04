import MicroPlugin from '@base/MicroPlugin'
import { CategoriesResponse } from '@networking/CategoriesResponse'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { StoredSettings } from '@stores/StoredSettings'

/*
 * Tag Synchronization Delegate Interface, implemented by
 * the object which needs to observe synchronization events.
 */
export interface TagSynchronizationServiceDelegate {

    // Triggered when tag synchronization succeeds.
    tagSynchronizationDidSucceed(count: number): void

    // Triggered when tag synchronization fails.
    tagSynchronizationDidFail(error: Error): void
}

export interface TagSynchronizationServiceInterface {

    // Fetches the categories if the user has an app token set.
    fetchTags(): void
}

/*
 * The service responsible for making the synchronization request.
 */
export class TagSynchronizationService implements TagSynchronizationServiceInterface {

    // Properties

    private delegate?: TagSynchronizationServiceDelegate

    // Life cycle

    private settings: StoredSettings
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface
    private plugin: MicroPlugin

    // Life cycle

    constructor(
        plugin: MicroPlugin,
        settings: StoredSettings,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface,
        delegate?: TagSynchronizationServiceDelegate
    ) {
        this.plugin = plugin
        this.settings = settings
        this.networkClient = networkClient
        this.networkRequestFactory = networkRequestFactory
        this.delegate = delegate
    }

    // Public

    public async fetchTags() {
        try {
            const response = await this.networkClient.run<CategoriesResponse>(
                this.networkRequestFactory.makeCategoriesRequest()
            )

            this.settings.tagSuggestions = response.categories
            this.plugin.saveSettings()

            this.delegate?.tagSynchronizationDidSucceed(response.categories.length)
            console.log('Categories synchronized: ' + response.categories)
        } catch (error) {
            this.delegate?.tagSynchronizationDidFail(error)
            console.log('Categories synchronization error: ' + error)
        }
    }
}