import '@extensions/String'
import { MarkdownView } from 'obsidian'
import { FrontmatterServiceInterface } from '@services/FrontmatterService'

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
}

/*
 * Post from the Markdown file.
 */
export class MarkdownPost implements MarkdownPostInterface {

    // Properties

    private frontmatterProcessor: FrontmatterServiceInterface
    private markdownView: MarkdownView

    // Life cycle

    constructor(
        frontmatterProcessor: FrontmatterServiceInterface,
        markdownView: MarkdownView
    ) {
        this.frontmatterProcessor = frontmatterProcessor
        this.markdownView = markdownView
    }

    // Public

    public get title(): string {
        const filename = this.markdownView.file?.basename
        const frontmatterTitle = this.frontmatterProcessor
            .retrieveString('title')

        return frontmatterTitle || filename || ""
    }

    public get content(): string {
        return this.markdownView.editor
            .getValue()
            .removeFrontmatter()
    }

    public get tags(): string | null | undefined {
        const frontmatterTags = this.frontmatterProcessor
            .retrieveStrings('tags')

        return frontmatterTags?.join(',')
    }

    public get url(): string | null {
        const url = this.frontmatterProcessor
            .retrieveString('url')

        return url
    }
}
