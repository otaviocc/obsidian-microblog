import { MicroPluginContainerInterface } from "@base/MicroPluginContainer";
import {
    TagSynchronizationServiceInterface,
    TagSynchronizationService,
    TagSynchronizationServiceDelegate
} from "@services/TagSynchronizationService";

export interface ServiceFactoryInterface {

    makeTagSynchronizationService(
        delegate?:TagSynchronizationServiceDelegate
    ): TagSynchronizationServiceInterface
}

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
    public makeTagSynchronizationService(
        delegate?:TagSynchronizationServiceDelegate
    ): TagSynchronizationServiceInterface {
        return new TagSynchronizationService(
            this.container.plugin,
            this.container.settings,
            this.container.networkClient,
            this.container.networkRequestFactory,
            delegate
        )
    }
}