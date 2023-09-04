import { MarkdownView } from 'obsidian'
import { MicroPluginSettingsViewModel } from '@views/MicroPluginSettingsViewModel'
import { PublishViewModel } from '@views/PublishViewModel'
import { TagSuggestionViewModel, TagSuggestionDelegate } from '@views/TagSuggestionViewModel'
import { ErrorViewModel } from '@views/ErrorViewModel'
import { MicroPluginContainerInterface } from '@base/MicroPluginContainer'
import { MarkdownPost } from '@models/MarkdownService'
import { FrontMatterProcessor } from '@services/FrontMatterProcessor'

export interface ViewModelFactoryInterface {

    // Builds the Publish View Model, used when Publishing a note
    // to Micro.blog via the Commands Palette.
    makePublishViewModel(
        markdownView: MarkdownView
    ): PublishViewModel

    // Builds the Plugin Settings View Model, used by the plugin
    // Settings.
    makeMicroPluginSettingsViewModel(): MicroPluginSettingsViewModel

    // Builds the Tags Suggestion View Model.
    makeTagSuggestionViewModel(
        excluding: Array<string>,
        delegate?: TagSuggestionDelegate
    ): TagSuggestionViewModel

    // Builds the Empty Post Error View Model.
    makeEmptyPostErrorViewModel(): ErrorViewModel
}

/*
 * View Model Factory builds all the View Models in the plugin.
 * It simplifies building View Models since all the resolved dependencies
 * are already available via the factory.
 */
export class ViewModelFactory implements ViewModelFactoryInterface {

    // Properties

    private container: MicroPluginContainerInterface

    // Life cycle

    constructor(
        container: MicroPluginContainerInterface
    ) {
        this.container = container
    }

    // Public

    public makePublishViewModel(
        markdownView: MarkdownView
    ): PublishViewModel {
        const frontMatterProcessor = new FrontMatterProcessor(
            this.container.plugin.app,
            markdownView.file
        )

        const markdownService = new MarkdownPost(
            frontMatterProcessor,
            markdownView
        )

        const tags = markdownService.tags || this.container.settings.defaultTags

        return new PublishViewModel(
            markdownService.title,
            markdownService.content,
            tags,
            this.container.settings.postVisibility,
            this.container.settings.blogs,
            this.container.settings.selectedBlogID,
            this.container.networkClient,
            frontMatterProcessor,
            this.container.networkRequestFactory,
            this
        )
    }

    public makeMicroPluginSettingsViewModel(): MicroPluginSettingsViewModel {
        return new MicroPluginSettingsViewModel(
            this.container.plugin,
            this.container.settings,
            this.container.networkClient,
            this.container.networkRequestFactory
        )
    }

    public makeTagSuggestionViewModel(
        excluding: Array<string>,
        delegate?: TagSuggestionDelegate,
    ): TagSuggestionViewModel {
        const suggestions = this.container.settings.tagSuggestions
            .filter(element =>
                !excluding.includes(element)
            )

        const viewModel = new TagSuggestionViewModel(
            suggestions
        )

        viewModel.delegate = delegate

        return viewModel
    }

    public makeEmptyPostErrorViewModel(): ErrorViewModel {
        return new ErrorViewModel(
            "Oops",
            "Micro.blog doesn't support blank posts. Write something first and try again."
        )
    }
}
