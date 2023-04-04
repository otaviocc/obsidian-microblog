import { MicroPluginContainerInterface } from '@base/MicroPluginContainer'
import { CategoriesResponse } from '@networking/CategoriesResponse'

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

    // The delegate object which will receive the events.
    delegate?: TagSynchronizationServiceDelegate

    // Fetches the categories if the user has an app token set.
    fetchTags(): void
}

/*
 * The service responsible for making the synchronization request.
 */
export class TagSynchronizationService implements TagSynchronizationServiceInterface {

    // Properties

    public delegate?: TagSynchronizationServiceDelegate
    private container: MicroPluginContainerInterface

    // Life cycle

    constructor(
        container: MicroPluginContainerInterface
    ) {
        this.container = container
    }

    // Public

    public async fetchTags() {
        try {
            const response = await this.container.networkClient.run<CategoriesResponse>(
                this.container.networkRequestFactory.makeCategoriesRequest()
            )

            this.container.settings.tagSuggestions = response.categories
            this.container.plugin.saveSettings()

            this.delegate?.tagSynchronizationDidSucceed(response.categories.length)
            console.log('Categories synchronized: ' + response.categories)
        } catch (error) {
            this.delegate?.tagSynchronizationDidFail(error)
            console.log('Categories synchronization error: ' + error)
        }
    }
}