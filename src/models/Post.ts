import { MarkdownView } from 'obsidian'
import '@extensions/String'

export class Post {

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
		return this.markdownView.editor.getValue().removeFrontmatter()
	}
}
