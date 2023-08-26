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

    // List of tag suggestions for new posts,
    // retrieved from Micro.blog for the selected blog.
    tagSuggestions: Array<string>
}

// Default values for the plugin.
export const defaultSettings: StoredSettings = {
    appToken: '',
    defaultTags: '',
    postVisibility: 'draft',
    blogs: {},
    selectedBlogID: 'default',
    tagSuggestions: []
}
