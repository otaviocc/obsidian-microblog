import MicroPlugin from '@base/MicroPlugin'
import { StoredSettings } from '@stores/StoredSettings'
import { MicroPluginSettingsViewModel } from '@views/MicroPluginSettingsViewModel'
import { PublishViewModel } from '@views/PublishViewModel'
import { NetworkRequestFactory } from '@networking/NetworkRequestFactory'
import { NetworkClient, NetworkClientInterface } from '@networking/NetworkClient'
import { TagSuggestionViewModel, TagSuggestionDelegate } from '@views/TagSuggestionViewModel'

export interface ViewModelFactoryInterface {

    // Builds the Publish View Model, used when Publishing a note
    // to Micro.blog via the Commands Palette.
    makePublishViewModel(
        title: string,
        content: string
    ): PublishViewModel

    // Builds the Plugin Settings View Model, used by the plugin
    // Settings.
    makeMicroPluginSettingsViewModel(): MicroPluginSettingsViewModel

    // Builds the Tags Suggestion View Mode.
    makeTagSuggestionViewModel(
        delegate?: TagSuggestionDelegate
    ): TagSuggestionViewModel
}

/*
 * View Model Factory builds all the View Models in the plugin.
 * It simplifies building View Models since all the resolved dependencies
 * are already available via the factory.
 */
export class ViewModelFactory implements ViewModelFactoryInterface {

    // Properties

    private settings: StoredSettings
    private plugin: MicroPlugin
    private networkClient: NetworkClientInterface

    // Life cycle

    constructor(
        settings: StoredSettings,
        plugin: MicroPlugin
    ) {
        this.settings = settings
        this.plugin = plugin
        this.networkClient = new NetworkClient(() => {
            return this.settings.appToken
        })
    }

    // Public

    public makePublishViewModel(
        title: string,
        content: string
    ): PublishViewModel {
        return new PublishViewModel(
            title,
            content,
            this.settings.defaultTags,
            this.settings.postVisibility,
            this.settings.blogs,
            this.settings.selectedBlogID,
            this.networkClient,
            new NetworkRequestFactory(),
            this
        )
    }

    public makeMicroPluginSettingsViewModel(): MicroPluginSettingsViewModel {
        return new MicroPluginSettingsViewModel(
            this.plugin,
            this.settings,
            this.networkClient,
            new NetworkRequestFactory(),
        )
    }

    public makeTagSuggestionViewModel(
        delegate?: TagSuggestionDelegate
    ): TagSuggestionViewModel {
        return new TagSuggestionViewModel(
            this.settings.tags,
            delegate
        )
    }
}