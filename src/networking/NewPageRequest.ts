/*
MIT License

Copyright (c) 2022 Otavio C.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
 * Definition of the JSON used to create a page.
 */
export type NewPageRequest = {
    'type': string
    'mp-destination'?: string
    'mp-channel': string
    'mp-navigation': string
    'properties': {
        'name': string[]
        'content': string[],
        'summary'?: string[]
    }
}

// Factory method to create the `NewPageRequest`.
export function makeNewPageRequest(
    title: string,
    content: string,
    blogID: string,
    navigation: boolean,
    summary: string = ''
): NewPageRequest {
    return {
        'type': "h-entry",
        ...blogID.length > 0 && blogID !== 'default' && { 'mp-destination': blogID },
        'mp-channel': 'pages',
        'mp-navigation': navigation.toString(),
        'properties': {
            'name': [title],
            'content': [content],
            ...summary.length > 0 && { 'summary': [summary] }
        }
    }
}
