import '@extensions/String'
import { FrontmatterServiceInterface } from '@services/FrontmatterService'
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

    // The blog ID.
    blogID: string | null
}

/*
 * Post from the Markdown file.
 */
export class MarkdownPost implements MarkdownPostInterface {

    // Properties

    private frontmatterService: FrontmatterServiceInterface
    private markdownView: MarkdownView

    // Life cycle

    constructor(
        frontmatterService: FrontmatterServiceInterface,
        markdownView: MarkdownView
    ) {
        this.frontmatterService = frontmatterService
        this.markdownView = markdownView
    }

    // Public

    public get title(): string {
        const filename = this.markdownView.file?.basename
        const frontmatterTitle = this.frontmatterService
            .retrieveString('title')

        return frontmatterTitle || filename || ""
    }

    public get content(): string {
        return this.markdownView.editor
            .getValue()
            .removeFrontmatter()
    }

    public get tags(): string | null | undefined {
        const frontmatterTags = this.frontmatterService
            .retrieveStrings('tags')

        return frontmatterTags?.join(',')
    }

    public get url(): string | null {
        const url = this.frontmatterService
            .retrieveString('url')

        return url
    }

    public get blogID(): string | null {
        const blogID = this.frontmatterService
            .retrieveString('blog-id')

        return blogID
    }
}
