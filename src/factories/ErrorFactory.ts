import { RequestUrlResponse } from 'obsidian'

/*
 * Factory responsible for creating Errors from network responses.
 */
export class ErrorFactory {

    // The Micropub specification defines response errors as:
    //
    // {
    //   "error": "invalid_request",
    //    "error_description": "The post with the requested URL was not found"
    // }
    //
    // Builds an Error instance from Obsidian's RequestUrlResponse.
    public static makeErrorFromRequestUrlResponse(
        response: RequestUrlResponse
    ): Error {
        let errorDetails = ''

        try {
            const errorResponse = JSON.parse(response.text)
            const hasError = errorResponse.error
            const hasDescription = errorResponse.error_description

            if (hasError && hasDescription) {
                errorDetails = errorResponse.error_description
            } else if (hasError) {
                errorDetails = 'Micro.blog error code: ' + errorResponse.error
            } else {
                errorDetails = 'Network error: ' + response.status
            }
        } catch {
            errorDetails = 'Network error: ' + response.status
        }

        return new Error(errorDetails)
    }
}
