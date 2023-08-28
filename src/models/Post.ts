import { FrontMatterCache, MarkdownView } from 'obsidian'
import { parseFrontMatterEntry, parseFrontMatterStringArray } from 'obsidian'
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
    tags: string | null | undefined
}

/*
 * Post from the Markdown file.
 */
export class Post implements PostInterface {

    // Properties

    private markdownView: MarkdownView
    private frontmatter: FrontMatterCache | undefined

    // Life cycle

    constructor(
        markdownView: MarkdownView
    ) {
        this.markdownView = markdownView
        this.frontmatter = app.metadataCache.getFileCache(
            this.markdownView.file
        )?.frontmatter
    }

    // Public

    public get title(): string {
        const filename = this.markdownView.file.basename
        const frontmatterTitle = parseFrontMatterEntry(
            this.frontmatter,
            'title'
        )

        return frontmatterTitle || filename
    }

    public get content(): string {
        return this.markdownView.editor
            .getValue()
            .removeFrontmatter()
    }

    public get tags(): string | null | undefined {
        const tags = parseFrontMatterStringArray(
            this.frontmatter,
            'tags'
        )

        return tags?.join(',')
    }
}
