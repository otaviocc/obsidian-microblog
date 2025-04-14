/*
 * Generic network request.
 */
export type NetworkRequest = {
    path: string
    method: string
    body?: string | FormData
    parameters?: URLSearchParams
}
