import '@extensions/String'
import { App, FrontMatterCache, parseFrontMatterEntry, parseFrontMatterStringArray, TFile } from 'obsidian'

export interface FrontmatterServiceInterface {

    // Saves or delete an entry to the frontmatter.
    save(
        value: string | null,
        key: string
    ): void

    // Retrieves a string from the frontmatter.
    retrieveString(
        key: string
    ): string | null

    // Retrieves an array of strings from the frontmatter.
    retrieveStrings(
        key: string
    ): string[] | null
}

/*
 * `FrontmatterService`, responsible for manipulating (reading, and writing)
 * to a file's frontmatter.
 */
export class FrontmatterService implements FrontmatterServiceInterface {

    // Properties

    private app: App
    private file: TFile | null

    // Life cycle

    constructor(
        app: App,
        file: TFile | null
    ) {
        this.app = app
        this.file = file
    }

    // Public

    public save(
        value: string | null,
        key: string
    ) {
        if (!this.file) return

        try {
            this.app.fileManager.processFrontMatter(this.file, frontmatter => {
                value === null
                    ? delete frontmatter[key]
                    : frontmatter[key] = value
            })
        } catch (error) {
            console.log('Error saving to YAML frontmatter: ' + error)
        }
    }

    public retrieveString(
        key: string
    ): string | null {
        const frontmatter = this.parseFrontmatterFromFile()
        const entry = parseFrontMatterEntry(frontmatter, key)

        return typeof entry === 'string'
            ? entry
            : null
    }

    public retrieveStrings(
        key: string
    ): string[] | null {
        const frontmatter = this.parseFrontmatterFromFile()
        return parseFrontMatterStringArray(frontmatter, key)
    }

    // Private

    private parseFrontmatterFromFile(): FrontMatterCache | undefined {
        return this.file
            ? this.app.metadataCache.getFileCache(this.file)?.frontmatter
            : undefined
    }
}
