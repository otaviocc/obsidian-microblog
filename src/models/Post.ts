import { MarkdownView } from 'obsidian'
import '@extensions/String'

export interface PostInterface {

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
    tags: string | undefined
}

/*
 * Post from the Markdown file.
 */
export class Post implements PostInterface {

    // Properties

    private markdownView: MarkdownView

    // Life cycle

    constructor(
        markdownView: MarkdownView
    ) {
        this.markdownView = markdownView
    }

    // Public

    public get title(): string {
        const file = this.markdownView.file
        const fileCache = app.metadataCache.getFileCache(file)
        const frontmatter = fileCache?.frontmatter

        return (frontmatter && frontmatter.title) || file.basename
    }

    public get content(): string {
        return this.markdownView.editor
            .getValue()
            .removeFrontmatter()
    }

    public get tags(): string | undefined {
        const file = this.markdownView.file
        const fileCache = app.metadataCache.getFileCache(file)

        return fileCache
            ?.frontmatter
            ?.tags
            ?.join(',')
    }
}
