import { MicroPluginContainerInterface } from '@base/MicroPluginContainer'
import { MicropostViewModel } from '@base/views/MicropostViewModel'
import { ServiceFactoryInterface } from '@factories/ServiceFactory'
import { MarkdownPage, MarkdownPageInterface } from '@models/MarkdownPage'
import { MarkdownPost, MarkdownPostInterface } from '@models/MarkdownPost'
import { FrontmatterServiceInterface } from '@services/FrontmatterService'
import { ErrorViewModel } from '@views/ErrorViewModel'
import { MicroPluginSettingsViewModel } from '@views/MicroPluginSettingsViewModel'
import { PublishPageViewModel } from '@views/PublishPageViewModel'
import { PublishPostViewModel } from '@views/PublishPostViewModel'
import { TagSuggestionDelegate, TagSuggestionViewModel } from '@views/TagSuggestionViewModel'
import { UpdatePageViewModel } from '@views/UpdatePageViewModel'
import { UpdatePostViewModel } from '@views/UpdatePostViewModel'
import { MarkdownView } from 'obsidian'

export interface ViewModelFactoryInterface {

    // Builds either the `PublishPostViewModel`, for publishing a note
    // to Micro.blog, or the `UpdatePostViewModel`, to update a post.
    makeSubmitPostViewModel(
        markdownView: MarkdownView
    ): PublishPostViewModel | UpdatePostViewModel

    // Builds either the `PublishPageViewModel`, for publishing a page
    // to Micro.blog, or the `UpdatePageViewModel`, to update a page.
    makeSubmitPageViewModel(
        markdownView: MarkdownView
    ): PublishPageViewModel | UpdatePageViewModel

    // Builds the `MicroPluginSettingsViewModel`, used by the plugin
    // Settings.
    makeMicroPluginSettingsViewModel(): MicroPluginSettingsViewModel

    // Builds the `TagSuggestionViewModel`.
    makeTagSuggestionViewModel(
        blogID: string,
        excluding: string[],
        delegate?: TagSuggestionDelegate
    ): TagSuggestionViewModel

    // Builds the `MicropostViewModel`.
    makeMicropostViewModel(): MicropostViewModel

    // Builds the Empty Post Error View Model.
    makeEmptyPostErrorViewModel(): ErrorViewModel

    // Builds the Empty Page Error View Model.
    makeEmptyPageErrorViewModel(): ErrorViewModel
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
        container: MicroPluginContainerInterface,
        serviceFactory: ServiceFactoryInterface
    ) {
        this.container = container
        this.serviceFactory = serviceFactory
    }

    // Public

    public makeSubmitPostViewModel(
        markdownView: MarkdownView
    ): PublishPostViewModel | UpdatePostViewModel {
        const frontmatterService = this.serviceFactory
            .makeFrontmatterService(markdownView.file)

        const imageService = this.serviceFactory
            .makeImageService(markdownView.file)

        const post = new MarkdownPost(
            frontmatterService,
            imageService,
            markdownView
        )

        if (post.url && post.url.length > 0) {
            return this.makeUpdatePostViewModel(
                post.url,
                post.title,
                post.content,
                post.tags || "",
                frontmatterService
            )
        } else {
            return this.makePublishPostViewModel(
                post,
                frontmatterService
            )
        }
    }

    public makeSubmitPageViewModel(
        markdownView: MarkdownView
    ): PublishPageViewModel | UpdatePageViewModel {
        const frontmatterService = this.serviceFactory
            .makeFrontmatterService(markdownView.file)

        const page = new MarkdownPage(
            frontmatterService,
            markdownView
        )

        if (page.url && page.url.length > 0) {
            return this.makeUpdatePageViewModel(
                page.url,
                page.title,
                page.content,
                frontmatterService
            )
        } else {
            return this.makePublishPageViewModel(
                page,
                frontmatterService
            )
        }
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
        blogID: string,
        excluding: string[],
        delegate?: TagSuggestionDelegate,
    ): TagSuggestionViewModel {
        const suggestions = this
            .synchronizedCategories(blogID)
            .filter(element =>
                !excluding.includes(element)
            )
            .sort()

        const viewModel = new TagSuggestionViewModel(
            suggestions
        )

        viewModel.delegate = delegate

        return viewModel
    }

    public makeMicropostViewModel(): MicropostViewModel {
        return new MicropostViewModel(
            this.container.settings.postVisibility,
            this.container.settings.blogs,
            this.container.settings.selectedBlogID,
            this.container.networkClient,
            this.container.networkRequestFactory
        )
    }

    public makeEmptyPostErrorViewModel(): ErrorViewModel {
        return new ErrorViewModel(
            'Oops',
            'Micro.blog does not support blank posts. Please write something before trying again.'
        )
    }

    public makeEmptyPageErrorViewModel(): ErrorViewModel {
        return new ErrorViewModel(
            'Oops',
            'Micro.blog does not support blank pages. Please write something before trying again.'
        )
    }

    // Private

    private makePublishPostViewModel(
        post: MarkdownPostInterface,
        frontmatterService: FrontmatterServiceInterface
    ): PublishPostViewModel {
        const imageService = this.serviceFactory.makeImageService(
            this.container.plugin.app.workspace.getActiveFile()
        )

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
            imageService,
            this
        )
    }

    private makeUpdatePostViewModel(
        url: string,
        title: string,
        content: string,
        tags: string,
        frontmatterService: FrontmatterServiceInterface
    ): UpdatePostViewModel {
        const imageService = this.serviceFactory.makeImageService(
            this.container.plugin.app.workspace.getActiveFile()
        )

        return new UpdatePostViewModel(
            url,
            title,
            content,
            tags,
            this.container.settings.blogs,
            this.container.settings.selectedBlogID,
            frontmatterService,
            this.container.networkClient,
            this.container.networkRequestFactory,
            imageService,
            this
        )
    }

    private makePublishPageViewModel(
        page: MarkdownPageInterface,
        frontmatterService: FrontmatterServiceInterface
    ): PublishPageViewModel {
        const imageService = this.serviceFactory.makeImageService(
            this.container.plugin.app.workspace.getActiveFile()
        )

        return new PublishPageViewModel(
            page.title,
            page.content,
            this.container.settings.blogs,
            this.container.settings.selectedBlogID,
            this.container.settings.includePagesInNavigation,
            this.container.networkClient,
            frontmatterService,
            this.container.networkRequestFactory,
            imageService
        )
    }

    private makeUpdatePageViewModel(
        url: string,
        title: string,
        content: string,
        frontmatterService: FrontmatterServiceInterface
    ): UpdatePageViewModel {
        const imageService = this.serviceFactory.makeImageService(
            this.container.plugin.app.workspace.getActiveFile()
        )

        return new UpdatePageViewModel(
            url,
            title,
            content,
            this.container.settings.blogs,
            this.container.settings.selectedBlogID,
            this.container.networkClient,
            frontmatterService,
            this.container.networkRequestFactory,
            imageService
        )
    }

    // Return the categories for the selected blog.
    // In case the selected blog is the `default`, then show
    // all categories (removing duplicates).
    private synchronizedCategories(
        blogID: string
    ): string[] {
        const categories = this.container
            .settings
            .synchronizedCategories

        if (blogID == 'default') {
            return Array.from(
                new Set(
                    Object.values(categories).flat()
                )
            )
        } else {
            return categories[blogID]
        }
    }
}
