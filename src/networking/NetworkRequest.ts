/*
 * Definition of a network request. It specifies
 * the endpoint, url parameters, method used and
 * body sent.
 */
export type NetworkRequest = {
    path: string
    parameters: URLSearchParams
    method: string
    body?: string
}
