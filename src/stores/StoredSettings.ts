export interface StoredSettings {
    appToken: string
    defaultTags: string
    postVisibility: string,
    blogs: Record<string, string>,
    selectedBlogID: string
}

export const defaultSettings: StoredSettings = {
    appToken: '',
    defaultTags: '',
    postVisibility: 'draft',
    blogs: {},
    selectedBlogID: ''
}