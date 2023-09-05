import MicroPlugin from '@base/MicroPlugin'

import { NetworkClient, NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactory, NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { StoredSettings } from '@stores/StoredSettings'

export interface MicroPluginContainerInterface {

    // The stored plugin settings.
    settings: StoredSettings

    // The Micro.publish plugin.
    plugin: MicroPlugin

    // The network client used to perform network request.
    networkClient: NetworkClientInterface

    // The network request factory, used to build the
    // requests which will be executed by the network client.
    networkRequestFactory: NetworkRequestFactoryInterface
}

export class MicroPluginContainer implements MicroPluginContainerInterface {

    // Properties

    readonly settings: StoredSettings
    readonly plugin: MicroPlugin
    readonly networkClient: NetworkClientInterface
    readonly networkRequestFactory: NetworkRequestFactoryInterface

    // Life cycle

    constructor(
        settings: StoredSettings,
        plugin: MicroPlugin
    ) {
        this.settings = settings
        this.plugin = plugin
        this.networkRequestFactory = new NetworkRequestFactory()
        this.networkClient = new NetworkClient(() => {
            return this.settings.appToken
        })
    }
}
