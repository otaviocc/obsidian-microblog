import '@extensions/String'
import { FrontmatterServiceInterface } from '@services/FrontmatterService'
import { MarkdownView } from 'obsidian'

export interface MarkdownPageInterface {

    // Page title.
    // Returns either the title included
    // in the frontmatter, or the file name.
    title: string

    // Page Content.
    // Returns the markdown content, without the
    // front matter.
    content: string

    // URL of the published page.
    url: string | null
}

/*
 * Page from the Markdown file.
 */
export class MarkdownPage implements MarkdownPageInterface {

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

        return frontmatterTitle || filename || ''
    }

    public get content(): string {
        return this.markdownView.editor
            .getValue()
            .removeFrontmatter()
            .removeObsidianLinks()
    }

    public get url(): string | null {
        const url = this.frontmatterService
            .retrieveString('url')

        return url
    }
}
