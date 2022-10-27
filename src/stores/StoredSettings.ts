/*
 * Plugin settings.
 */
export interface StoredSettings {
    appToken: string
    tags: string
    postVisibility: string,
    blogs: Record<string, string>,
    selectedBlogID: string,
    tagSuggestions: Array<string>
}

// Default values for the plugin.
export const defaultSettings: StoredSettings = {
    appToken: '',
    tags: '',
    postVisibility: 'draft',
    blogs: {},
    selectedBlogID: 'default',
    tagSuggestions: []
}