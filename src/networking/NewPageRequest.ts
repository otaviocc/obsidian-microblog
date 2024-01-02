/*
 * Definition of the JSON used to create a page.
 */
export type NewPageRequest = {
    'type': string
    'mp-destination'?: string
    'mp-channel': string
    'mp-navigation': string
    'properties': {
        'name': string[]
        'content': string[],
    }
}

// Factory method to create the `NewPageRequest`.
export function makeNewPageRequest(
    title: string,
    content: string,
    blogID: string,
    navigation: boolean
): NewPageRequest {
    return {
        'type': "h-entry",
        ...blogID.length > 0 && blogID !== 'default' && { 'mp-destination': blogID },
        'mp-channel': 'pages',
        'mp-navigation': navigation.toString(),
        'properties': {
            'name': [title],
            'content': [content]
        }
    }
}
