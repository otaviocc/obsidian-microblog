import { NetworkRequest } from '@networking/NetworkRequest'

export interface NetworkRequestFactoryInterface {

    // Builds the publish request, network request used to publish a new
    // post to Micro.blog.
    makePublishRequest(
        title: string,
        content: string,
        tags: string,
        visibility: string,
        blogID: string
    ): NetworkRequest

    // Builds the configuration request, network request used to "log in"
    // the user. The config network request returns the list of blogs the
    // user can post to.
    makeConfigRequest(): NetworkRequest
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
        blogID: string
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

        tags
            .split(",")
            .forEach(value => {
                parameters.append('category[]', value.trim())
            })

        return new NetworkRequest(
            '/micropub',
            parameters,
            'POST'
        )
    }

    public makeConfigRequest(): NetworkRequest {
        return new NetworkRequest(
            '/micropub',
            new URLSearchParams([
                ['q', 'config']
            ]),
            'GET'
        )
    }
}