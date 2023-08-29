import '@extensions/String'
import { MarkdownView, TFile } from 'obsidian'
import { parseFrontMatterEntry, parseFrontMatterStringArray } from 'obsidian'

declare module 'obsidian' {

    interface MarkdownView {

        // Post title.
        // Returns either the title included
        // in the frontmatter, or the file name.
        title(): string

        // Post Content.
        // Returns the markdown content, without the
        // front matter.
        content(): string

        // Tags.
        // Returns a string with the tags in the frontmatter,
        // if applicable.
        tags(): string | null | undefined
    }
}

MarkdownView.prototype.title = function() {
    const filename = this.file.basename
    const frontmatter = parseFrontMatterFromFile(this.file)
    const frontmatterTitle = parseFrontMatterEntry(
        frontmatter,
        'title'
    )

    return frontmatterTitle || filename
}

MarkdownView.prototype.content = function() {
    return this.editor.getValue().removeFrontmatter()
}

MarkdownView.prototype.tags = function() {
    const frontmatter = parseFrontMatterFromFile(this.file)
    const frontmatterTags = parseFrontMatterStringArray(
        frontmatter,
        'tags'
    )

    return frontmatterTags?.join(',')
}

function parseFrontMatterFromFile(file: TFile) {
    return app.metadataCache.getFileCache(file)?.frontmatter
}

export { }
