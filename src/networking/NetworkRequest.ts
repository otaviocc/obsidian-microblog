/*
 * Definition of a network request. It specifies
 * the endpoint, url parameters, method used and
 * body sent.
 */
export class NetworkRequest {

    // Properties

    readonly path: string
    readonly parameters: URLSearchParams
    readonly method: string
    readonly body?: string

    // Life cycle

    constructor(
        path: string,
        parameters: URLSearchParams,
        method: string,
        body?: string
    ) {
        this.path = path
        this.parameters = parameters
        this.body = body
        this.method = method
    }
}