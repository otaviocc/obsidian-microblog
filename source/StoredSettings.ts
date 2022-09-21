export interface StoredSettings {
    appToken: string
    defaultTags: string
    postVisibility: string
}

export const defaultSettings: StoredSettings = {
    appToken: '',
    defaultTags: '',
    postVisibility: 'draft'
}