/**
 * Represents a request for uploading media to Micro.blog.
 */
export interface MediaRequest {
    mediaBuffer: ArrayBuffer
    filename: string
    contentType: string
    blogID?: string
}

/**
 * Creates a multipart form data request body from a MediaRequest.
 */
export function makeMediaRequestBody(request: MediaRequest): {
    body: ArrayBuffer
    boundary: string
} {
    const boundary = `----WebKitFormBoundary${Math.random().toString(16).substring(2)}`

    let formDataContent = ''
    formDataContent += `--${boundary}\r\n`
    formDataContent += `Content-Disposition: form-data; name="file"; filename="${request.filename}"\r\n`
    formDataContent += `Content-Type: ${request.contentType}\r\n\r\n`

    let postFileContent = ''

    if (request.blogID && request.blogID !== 'default') {
        postFileContent += `\r\n--${boundary}\r\n`
        postFileContent += `Content-Disposition: form-data; name="mp-destination"\r\n\r\n`
        postFileContent += `${request.blogID}\r\n`
    }

    if (!(request.blogID && request.blogID !== 'default')) {
        postFileContent += `\r\n`
    }

    postFileContent += `--${boundary}--\r\n`

    const encoder = new TextEncoder()
    const formDataHeaders = encoder.encode(formDataContent)
    const formDataFooter = encoder.encode(postFileContent)
    const combinedData = new Uint8Array(
        formDataHeaders.length + request.mediaBuffer.byteLength + formDataFooter.length
    )

    combinedData.set(formDataHeaders, 0)
    combinedData.set(new Uint8Array(request.mediaBuffer), formDataHeaders.length)
    combinedData.set(formDataFooter, formDataHeaders.length + request.mediaBuffer.byteLength)

    return {
        body: combinedData.buffer,
        boundary
    }
}
