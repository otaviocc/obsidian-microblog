export class NetworkRequest {
    path: string
    parameters: Record<string, string>
    method: string
    body?: string
    
    constructor(path: string, parameters: Record<string, string>, method: string, body?: string) {
        this.path = path
        this.parameters = parameters
        this.body = body
        this.method = method
    }
}