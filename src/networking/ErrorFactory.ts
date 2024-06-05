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
    // This method is responsible for building an Error instance with the
    // information contained in the response error (if any).
    public static async makeErrorFromResponse(
        response: Response
    ): Promise<Error> {
        let errorDetails = ''

        const errorResponse = await response.json()
        const hasError = errorResponse.error
        const hasDescription = errorResponse.error_description

        if (hasError && hasDescription) {
            errorDetails = errorResponse.error_description
        } else if (hasError) {
            errorDetails = 'Micro.blog error code: ' + errorResponse.error
        } else {
            errorDetails = 'Network error: ' + response.status
        }

        return new Error(errorDetails)
    }
}
