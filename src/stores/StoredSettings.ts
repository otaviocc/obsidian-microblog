/*
 * Plugin settings.
 */
export interface StoredSettings {
    appToken: string
    defaultTags: string
    postVisibility: string,
    blogs: Record<string, string>,
    selectedBlogID: string,
    tags: Array<string>
}

// Default values for the plugin.
export const defaultSettings: StoredSettings = {
    appToken: '',
    defaultTags: '',
    postVisibility: 'draft',
    blogs: {},
    selectedBlogID: 'default',
    tags: []
}