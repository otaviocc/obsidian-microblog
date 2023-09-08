/*
 * Definition of the JSON used to update a post.
 */
export type UpdatePostRequest = {
    action: string
    url: string
    replace: {
        content: string[]
    }
}

// Factory method to create the `UpdatePostRequest`.
export function makeUpdatePostRequest(
    url: string,
    content: string
): UpdatePostRequest {
    return {
        action: 'update',
        url: url,
        replace: {
            content: [content]
        }
    }
}
