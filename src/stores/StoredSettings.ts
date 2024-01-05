/*
 * Plugin settings.
 */
export interface StoredSettings {

    // Application token used to access Micro.blog.
    appToken: string

    // Default tags (set in Settings) that applies
    // to all new posts.
    defaultTags: string

    // Default post visibility (set in Settings)
    // that applies to all new posts.
    postVisibility: string

    // List of blogs available for the given app token.
    blogs: Record<string, string>

    // Default blog used for new posts.
    selectedBlogID: string

    // List of synchronized categories used for suggestions
    // in new posts.
    synchronizedCategories: Record<string, string[]>

    // Boolean indicating if pages should be added
    // to the blog navigation.
    includePagesInNavigation: boolean

    // Boolean indicating if the plugin should synchronize
    // the list of categories when Obsidian opens.
    synchronizeCategoriesOnOpen: boolean
}

// Default values for the plugin.
export const defaultSettings: StoredSettings = {
    appToken: '',
    defaultTags: '',
    postVisibility: 'draft',
    blogs: {},
    selectedBlogID: 'default',
    synchronizedCategories: {},
    includePagesInNavigation: false,
    synchronizeCategoriesOnOpen: true
}
