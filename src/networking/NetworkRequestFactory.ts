import { NetworkRequest } from '@networking/NetworkRequest'
import { MediaRequest } from '@networking/MediaRequest'
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
    // categories (a.k.a. tags) used in previous posts.
    makeCategoriesRequest(
        blogID: string
    ): NetworkRequest

    // Builds the network request to update a post or page.
    makeUpdateRequest(
        url: string,
        blogID: string,
        title: string,
        content: string,
        tags?: string[]
    ): NetworkRequest

    // Builds a media upload request for uploading files to Micro.blog.
    makeMediaUploadRequest(
        mediaBuffer: ArrayBuffer,
        filename: string,
        contentType: string,
        blogID?: string
    ): MediaRequest
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

    public makeCategoriesRequest(
        blogID: string
    ): NetworkRequest {
        return {
            path: '/micropub',
            parameters: new URLSearchParams([
                ['q', 'category'],
                ['mp-destination', blogID]
            ]),
            method: 'GET'
        }
    }

    public makeUpdateRequest(
        url: string,
        blogID: string,
        title: string,
        content: string,
        tags?: string[]
    ): NetworkRequest {
        const body = JSON.stringify(
            makeUpdatePostRequest(
                url,
                blogID,
                title,
                content,
                tags
            )
        )

        return {
            path: '/micropub',
            method: 'POST',
            body: body
        }
    }

    public makeMediaUploadRequest(
        mediaBuffer: ArrayBuffer,
        filename: string,
        contentType: string,
        blogID?: string
    ): MediaRequest {
        return {
            mediaBuffer,
            filename,
            contentType,
            blogID
        }
    }
}
