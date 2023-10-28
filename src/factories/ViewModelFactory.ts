import { MicroPluginContainerInterface } from '@base/MicroPluginContainer'
import { ServiceFactory, ServiceFactoryInterface } from '@factories/ServiceFactory'
import { MarkdownPost, MarkdownPostInterface } from '@models/MarkdownPost'
import { FrontmatterServiceInterface } from '@services/FrontmatterService'
import { ErrorViewModel } from '@views/ErrorViewModel'
import { MicroPluginSettingsViewModel } from '@views/MicroPluginSettingsViewModel'
import { PublishPostViewModel } from '@views/PublishPostViewModel'
import { TagSuggestionDelegate, TagSuggestionViewModel } from '@views/TagSuggestionViewModel'
import { UpdateViewModel } from '@views/UpdateViewModel'
import { MarkdownView } from 'obsidian'

export interface ViewModelFactoryInterface {

    // Builds either the `PublishPostViewModel`, for publishing a note
    // to Micro.blog, or the `UpdateViewModel`, to update a note.
    makeSubmitViewModel(
        markdownView: MarkdownView
    ): PublishPostViewModel | UpdateViewModel

    // Builds the `MicroPluginSettingsViewModel`, used by the plugin
    // Settings.
    makeMicroPluginSettingsViewModel(): MicroPluginSettingsViewModel

    // Builds the `TagSuggestionViewModel`.
    makeTagSuggestionViewModel(
        excluding: Array<string>,
        delegate?: TagSuggestionDelegate
    ): TagSuggestionViewModel

    // Builds the Empty Post `ErrorViewModel`.
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
    private serviceFactory: ServiceFactoryInterface

    // Life cycle

    constructor(
        container: MicroPluginContainerInterface
    ) {
        this.container = container
        this.serviceFactory = new ServiceFactory(container)
    }

    // Public

    public makeSubmitViewModel(
        markdownView: MarkdownView
    ): PublishPostViewModel | UpdateViewModel {
        const frontmatterServices = this.serviceFactory
            .makeFrontmatterService(markdownView.file)

        const post = new MarkdownPost(
            frontmatterServices,
            markdownView
        )

        if (post.url && post.url.length > 0) {
            return this.makeUpdateViewModel(
                post.url,
                post.title,
                post.content
            )
        } {
            return this.makePublishPostViewModel(
                post,
                frontmatterServices
            )
        }
    }

    public makePublishPostViewModel(
        post: MarkdownPostInterface,
        frontmatterService: FrontmatterServiceInterface
    ): PublishPostViewModel {
        return new PublishPostViewModel(
            post.title,
            post.content,
            post.tags || this.container.settings.defaultTags,
            this.container.settings.postVisibility,
            this.container.settings.blogs,
            this.container.settings.selectedBlogID,
            this.container.networkClient,
            frontmatterService,
            this.container.networkRequestFactory,
            this
        )
    }

    public makeUpdateViewModel(
        url: string,
        title: string,
        content: string,
    ): UpdateViewModel {
        return new UpdateViewModel(
            url,
            title,
            content,
            this.container.settings.blogs,
            this.container.settings.selectedBlogID,
            this.container.networkClient,
            this.container.networkRequestFactory
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
            'Oops',
            'Micro.blog does not support blank posts. Please write something before trying again.'
        )
    }
}
