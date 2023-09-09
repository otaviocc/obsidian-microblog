/*
 * Definition of the JSON used to update a post.
 */
export type UpdatePostRequest = {
    'action': string
    'url': string
    'mp-destination': string
    'replace': {
        'content': string[]
    }
}

// Factory method to create the `UpdatePostRequest`.
export function makeUpdatePostRequest(
    url: string,
    blogID: string,
    content: string
): UpdatePostRequest {
    return {
        'action': 'update',
        'url': url,
        'mp-destination': blogID,
        'replace': {
            'content': [content]
        }
    }
}
