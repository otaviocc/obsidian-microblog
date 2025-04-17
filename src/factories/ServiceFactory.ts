import { MicroPluginContainerInterface } from '@base/MicroPluginContainer'
import { FrontmatterService, FrontmatterServiceInterface } from '@services/FrontmatterService'
import { TagSynchronizationService, TagSynchronizationServiceDelegate, TagSynchronizationServiceInterface } from '@services/TagSynchronizationService'
import { ImageService, ImageServiceInterface } from '@services/ImageService'
import { TFile } from 'obsidian'

export interface ServiceFactoryInterface {

    // Builds the frontmatter service for the giving file.
    makeFrontmatterService(
        file: TFile | null
    ): FrontmatterServiceInterface

    // Builds the synchronization service, used by the client
    // to synchronize categories when the plugin is loaded
    // and when synchronization is triggered via command.
    makeTagSynchronizationService(
        delegate?: TagSynchronizationServiceDelegate
    ): TagSynchronizationServiceInterface

    // Builds an image service for processing and uploading images
    makeImageService(
        file: TFile | null
    ): ImageServiceInterface
}

/*
 * `ServiceFactory` builds all the Services in the plugin.
 * It simplifies building View Models since all the resolved dependencies
 * are already available via the factory.
 */
export class ServiceFactory implements ServiceFactoryInterface {

    // Properties

    private container: MicroPluginContainerInterface

    // Life cycle

    constructor(
        container: MicroPluginContainerInterface
    ) {
        this.container = container
    }

    // Public

    public makeFrontmatterService(
        file: TFile | null
    ): FrontmatterServiceInterface {
        return new FrontmatterService(
            this.container.plugin.app,
            file
        )
    }

    public makeTagSynchronizationService(
        delegate?: TagSynchronizationServiceDelegate
    ): TagSynchronizationServiceInterface {
        return new TagSynchronizationService(
            this.container.plugin,
            this.container.settings,
            this.container.networkClient,
            this.container.networkRequestFactory,
            delegate
        )
    }

    public makeImageService(
        file: TFile | null
    ): ImageServiceInterface {
        const frontmatterService = this.makeFrontmatterService(
            file
        )

        return new ImageService(
            this.container.plugin.app,
            frontmatterService,
            this.container.networkClient,
            this.container.networkRequestFactory
        )
    }
}
