import '@extensions/String'
import {
    FrontMatterCache,
    MarkdownView,
    parseFrontMatterEntry,
    parseFrontMatterStringArray
} from 'obsidian'

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

    private filename: string
    private rawContent: string
    private frontmatter: FrontMatterCache | undefined

    // Life cycle

    constructor(
        markdownView: MarkdownView
    ) {
        this.filename = markdownView.file
            .basename

        this.rawContent = markdownView.editor
            .getValue()

        this.frontmatter = app.metadataCache
            .getFileCache(markdownView.file)
            ?.frontmatter
    }

    // Public

    public get title(): string {
        const frontmatterTitle = parseFrontMatterEntry(
            this.frontmatter,
            'title'
        )

        return frontmatterTitle || this.filename
    }

    public get content(): string {
        return this.rawContent
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
