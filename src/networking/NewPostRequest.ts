/*
 * Definition of the JSON used to create a post.
 */
export type NewPostRequest = {
    'type': string[]
    'mp-destination'?: string
    'properties': {
        "name"?: string[]
        'content': string[],
        'category': string[],
        'published'?: string[],
        'post-status': string[]
    }
}

// Factory method to create the `NewPostRequest`.
export function makeNewPostRequest(
    blogID: string,
    title: string,
    content: string,
    categories: string[],
    published: string,
    postStatus: string
): NewPostRequest {
    return {
        'type': ["h-entry"],
        ...blogID.length > 0 && blogID !== 'default' && { 'mp-destination': blogID },
        'properties': {
            ...title.length > 0 && { "name": [title] },
            'content': [content],
            'category': categories,
            ...published.length > 0 && { 'published': [published] },
            'post-status': [postStatus]
        }
    }
}
