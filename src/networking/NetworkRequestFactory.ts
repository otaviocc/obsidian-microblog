import { NetworkRequest } from '@networking/NetworkRequest'
import { makeNewPageRequest } from '@networking/NewPageRequest'
import { makeNewPostRequest } from '@networking/NewPostRequest'
import { makeUpdatePostRequest } from '@networking/UpdatePostRequest'

export interface NetworkRequestFactoryInterface {

    // Builds the publish request, `NetworkRequest` used to publish a new
    // post to Micro.blog.
    makePublishPostRequest(
        title: string,
        content: string,
        tags: string[],
        visibility: string,
        blogID: string,
        scheduledDate: string
    ): NetworkRequest

    // Builds the publish page request, `NetworkRequest` used to publish a new
    // page to Micro.blog.
    makePublishPageRequest(
        title: string,
        content: string,
        blogID: string,
        navigation: boolean
    ): NetworkRequest

    // Builds the configuration request, `NetworkRequest` used to log in
    // the user. The config network request returns the list of blogs the
    // user can post to.
    makeConfigRequest(): NetworkRequest

    // Builds the categories request, `NetworkRequest` used to fetch
    // categories (a..k.a. tags) used in previous posts.
    makeCategoriesRequest(): NetworkRequest

    // Builds the network request to update a post or page.
    makeUpdateRequest(
        url: string,
        blogID: string,
        title: string,
        content: string
    ): NetworkRequest
}

/*
 * `NetworkRequestFactory` builds all the network requests in the plugin.
 * It hides all the complexity, data transformation, etc... of building
 * network requests.
 */
export class NetworkRequestFactory implements NetworkRequestFactoryInterface {

    // Public

    public makePublishPostRequest(
        title: string,
        content: string,
        tags: string[],
        visibility: string,
        blogID: string,
        scheduledDate: string
    ): NetworkRequest {
        const body = JSON.stringify(
            makeNewPostRequest(
                blogID,
                title,
                content,
                tags,
                scheduledDate,
                visibility
            )
        )

        return {
            path: '/micropub',
            method: 'POST',
            body: body
        }
    }

    makePublishPageRequest(
        title: string,
        content: string,
        blogID: string,
        navigation: boolean
    ): NetworkRequest {
        const body = JSON.stringify(
            makeNewPageRequest(
                title,
                content,
                blogID,
                navigation
            )
        )

        return {
            path: '/micropub',
            method: 'POST',
            body: body
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

    public makeUpdateRequest(
        url: string,
        blogID: string,
        title: string,
        content: string
    ): NetworkRequest {
        const body = JSON.stringify(
            makeUpdatePostRequest(
                url,
                blogID,
                title,
                content
            )
        )

        return {
            path: '/micropub',
            method: 'POST',
            body: body
        }
    }
}
