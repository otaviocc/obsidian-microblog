/**
 * Response from Micro.blog media upload endpoint.
 * This can have several formats depending on the endpoint behavior
 */
export interface MediaResponse {

    // URL field that might be present in the response
    url?: string

    // Photo field that might be present (as string or array)
    photo?: string | string[]

    // Location field that might be present
    location?: string
}

/**
 * Extract the media URL from a media response
 * Handles the various formats Micro.blog might return.
 */
export function extractMediaURL(
    response: MediaResponse,
    locationHeader?: string
): string {
    if (response.url) {
        return response.url
    }

    if (response.photo) {
        if (typeof response.photo === 'string') {
            return response.photo
        }
        if (Array.isArray(response.photo) && response.photo.length > 0) {
            return response.photo[0]
        }
    }

    if (response.location) {
        return response.location
    }

    if (locationHeader) {
        return locationHeader
    }

    throw new Error('Unable to extract media URL from response data')
}
