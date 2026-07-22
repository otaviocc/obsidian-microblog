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

import '@extensions/String'
import { FrontmatterServiceInterface } from '@services/FrontmatterService'
import { ImageServiceInterface } from '@services/ImageService'
import { MarkdownView } from 'obsidian'

export interface MarkdownPostInterface {

    // Post title.
    // Returns either the title included
    // in the frontmatter, or the file name.
    title: string

    // Post Content.
    // Returns the markdown content, without the
    // front matter.
    content: string

    // Tags.
    // Returns a string with the tags in the frontmatter,
    // if applicable.
    tags: string | null | undefined

    // URL of the published post.
    url: string | null

    // A mapping of local image paths to their remote URLs.
    imageURLs: Record<string, string> | null
}

/*
 * Post from the Markdown file.
 */
export class MarkdownPost implements MarkdownPostInterface {

    // Properties

    private frontmatterService: FrontmatterServiceInterface
    private imageService: ImageServiceInterface
    private markdownView: MarkdownView
    private categoriesPropertyName: string

    // Life cycle

    constructor(
        frontmatterService: FrontmatterServiceInterface,
        imageService: ImageServiceInterface,
        markdownView: MarkdownView,
        categoriesPropertyName: string
    ) {
        this.frontmatterService = frontmatterService
        this.imageService = imageService
        this.markdownView = markdownView
        this.categoriesPropertyName = categoriesPropertyName
    }

    // Public

    public get title(): string {
        const filename = this.markdownView.file?.basename
        const frontmatterTitle = this.frontmatterService
            .retrieveString('title')

        return frontmatterTitle !== null
            ? frontmatterTitle
            : (filename || '')
    }

    public get content(): string {
        return this.markdownView.editor
            .getValue()
            .removeFrontmatter()
            .removeObsidianLinks()
    }

    public get tags(): string | null | undefined {
        const frontmatterCategories = this.frontmatterService
            .retrieveStrings(this.categoriesPropertyName)

        return frontmatterCategories?.join(',')
    }

    public get url(): string | null {
        const url = this.frontmatterService
            .retrieveString('url')

        return url
    }

    public get imageURLs(): Record<string, string> | null {
        const imageURLsString = this.frontmatterService
            .retrieveString('image_urls')

        if (!imageURLsString) {
            return null
        }

        try {
            return JSON.parse(imageURLsString)
        } catch (e) {
            return null
        }
    }
}
