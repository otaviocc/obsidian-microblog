import { App, TFile, FrontMatterCache } from "obsidian"
import { parseFrontMatterEntry, parseFrontMatterStringArray } from 'obsidian'

export interface FrontMatterProcessorInterface {

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
 * FrontMatter Processor, responsible for manipulating (reading, and writing)
 * to a file's frontmatter.
 */
export class FrontMatterProcessor implements FrontMatterProcessorInterface {

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
        if (this.file === null) { return }

        try {
            this.app.fileManager.processFrontMatter(this.file, (frontmatter) => {
                if (value === null) {
                    delete frontmatter[key]
                } else {
                    frontmatter[key] = value
                }
            })
        } catch (error) {
            console.log('Error saving to YAML frontmatter: ' + error)
        }
    }

    public retrieveString(
        key: string
    ): string | null {
        return parseFrontMatterEntry(
            this.parseFrontMatterFromFile(),
            key
        )
    }

    public retrieveStrings(
        key: string
    ): string[] | null {
        return parseFrontMatterStringArray(
            this.parseFrontMatterFromFile(),
            key
        )
    }

    // Private

    private parseFrontMatterFromFile(): FrontMatterCache | undefined {
        if (this.file === null) { return undefined }

        const fileCache = this.app.metadataCache.getFileCache(
            this.file
        )

        return fileCache?.frontmatter
    }
}
