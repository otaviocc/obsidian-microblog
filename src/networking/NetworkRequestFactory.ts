import { NetworkRequest } from '@networking/NetworkRequest'

export interface NetworkRequestFactoryInterface {

    // Builds the publish request, network request used to publish a new
    // post to Micro.blog.
    makePublishRequest(
        title: string,
        content: string,
        tags: string,
        visibility: string,
        blogID: string,
        scheduledDate: string
    ): NetworkRequest

    // Builds the configuration request, network request used to "log in"
    // the user. The config network request returns the list of blogs the
    // user can post to.
    makeConfigRequest(): NetworkRequest

    // Builds the categories request, network request used to fetch
    // categories (a..k.a. tags) used in previous posts.
    makeCategoriesRequest(): NetworkRequest
}

/*
 * Network Request Factory builds all the network requests in the plugin.
 * It hides all the complexity, data transformation, etc... of building
 * network requests.
 */
export class NetworkRequestFactory implements NetworkRequestFactoryInterface {

    // Public

    public makePublishRequest(
        title: string,
        content: string,
        tags: string,
        visibility: string,
        blogID: string,
        scheduledDate: string
    ): NetworkRequest {
        const parameters = new URLSearchParams([
            ['h', 'entry'],
            ['content', content],
            ['post-status', visibility]
        ])

        if (title.length > 0) {
            parameters.append('name', title)
        }

        if (blogID.length > 0 && blogID != 'default') {
            parameters.append('mp-destination', blogID)
        }

        if (scheduledDate.length > 0) {
            parameters.append('published', scheduledDate)
        }

        tags
            .split(",")
            .forEach(value => {
                parameters.append('category[]', value.trim())
            })

        return {
            path: '/micropub',
            parameters: parameters,
            method: 'POST'
        }
    }

    public makeConfigRequest(): NetworkRequest {
        return {
            path: '/micropub',
            parameters: new URLSearchParams([
                ['q', 'config']
            ]),
            method: 'GET'
        }
    }

    public makeCategoriesRequest(): NetworkRequest {
        return {
            path: '/micropub',
            parameters: new URLSearchParams([
                ['q', 'category']
            ]),
            method: 'GET'
        }
    }
}