import { App, TFile } from 'obsidian'
import { FrontmatterServiceInterface } from '@services/FrontmatterService'
import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import '@extensions/String'

/**
 * Delegate interface for ImageService to communicate with the UI layer.
 */
export interface ImageServiceDelegate {

    // Called when an image is processed (uploaded or found in cache).
    imageDidProcess(
        path: string,
        success: boolean,
        remoteURL?: string
    ): void

    // Called when an error occurs during image processing.
    imageProcessingDidFail(
        error: Error,
    ): void

    // Called when image processing begins with total count of images.
    imageProcessingDidBegin(
        totalImages: number
    ): void

    // Called when all image processing is complete.
    imageProcessingDidComplete(): void
}

export interface ImageServiceInterface {

    // Process image references in the content and upload any local images
    processAndUploadImages(
        content: string,
        blogID: string
    ): Promise<string>

    // Process content with image references before publishing.
    processContent(
        content: string,
        blogID: string
    ): Promise<string>

    // Delegate for communication with UI layer.
    delegate?: ImageServiceDelegate
}

/**
 * Interface for an image reference extracted from markdown.
 */
interface ImageReference {
    fullMatch: string;
    altText: string;
    path: string;
}

export class ImageService implements ImageServiceInterface {

    // Properties

    public delegate?: ImageServiceDelegate
    private app: App
    private frontmatterService: FrontmatterServiceInterface
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface

    // Life cycle

    constructor(
        app: App,
        frontmatterService: FrontmatterServiceInterface,
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface
    ) {
        this.app = app
        this.frontmatterService = frontmatterService
        this.networkClient = networkClient
        this.networkRequestFactory = networkRequestFactory
    }

    // Public

    public async processContent(
        content: string,
        blogID: string
    ): Promise<string> {
        if (!content.includes('![')) {
            return content
        }

        return await this.processAndUploadImages(
            content,
            blogID
        )
    }

    public async processAndUploadImages(
        content: string,
        blogID: string
    ): Promise<string> {
        const imageURLMap = await this.getImageURLMap()
        let processedContent = content

        const standardImages = this.extractStandardImageReferences(content)
        const wikiImages = this.extractWikiImageReferences(content)
        const allImages = [...standardImages, ...wikiImages]

        if (allImages.length > 0) {
            this.delegate?.imageProcessingDidBegin(allImages.length)
        }

        processedContent = await this.processImageReferences(
            processedContent,
            standardImages,
            imageURLMap,
            blogID
        )

        processedContent = await this.processImageReferences(
            processedContent,
            wikiImages,
            imageURLMap,
            blogID
        )

        if (allImages.length > 0) {
            this.delegate?.imageProcessingDidComplete()
        }

        return processedContent
    }

    // Private

    private extractStandardImageReferences(content: string): ImageReference[] {
        const images: ImageReference[] = []
        const imageRegex = /!\[(.*?)\]\((.*?)\)/g
        let match

        while ((match = imageRegex.exec(content)) !== null) {
            const [fullMatch, altText, path] = match

            if (path.startsWith('http')) {
                continue
            }

            images.push({ fullMatch, altText, path })
        }

        return images
    }

    private extractWikiImageReferences(content: string): ImageReference[] {
        const images: ImageReference[] = []
        const imageRegex = /!\[\[(.*?)\]\]/g
        let match

        while ((match = imageRegex.exec(content)) !== null) {
            const [fullMatch, path] = match
            images.push({ fullMatch, altText: path, path })
        }

        return images
    }

    private async processImageReferences(
        content: string,
        images: ImageReference[],
        imageURLMap: Record<string, string>,
        blogID: string
    ): Promise<string> {
        let processedContent = content

        for (const image of images) {
            try {
                if (imageURLMap[image.path]) {
                    const remoteURL = imageURLMap[image.path]
                    processedContent = this.replaceImageReference(
                        processedContent,
                        image,
                        remoteURL
                    )
                    this.delegate?.imageDidProcess(image.path, true, remoteURL)
                    continue
                }

                const imageFile = this.getImageFile(image.path)
                if (!imageFile) {
                    this.delegate?.imageDidProcess(image.path, false)
                    this.delegate?.imageProcessingDidFail(
                        new Error(`Image file not found: ${image.path}`)
                    )
                    continue
                }

                const remoteURL = await this.uploadImageFile(imageFile, blogID)
                if (!remoteURL) {
                    this.delegate?.imageDidProcess(image.path, false)
                    continue
                }

                await this.saveImageURL(image.path, remoteURL)

                processedContent = this.replaceImageReference(
                    processedContent,
                    image,
                    remoteURL
                )

                this.delegate?.imageDidProcess(image.path, true, remoteURL)
            } catch {
                this.delegate?.imageDidProcess(image.path, false)
                this.delegate?.imageProcessingDidFail(
                    new Error(`Error processing image: ${image.path}`)
                )
            }
        }

        return processedContent
    }

    private replaceImageReference(
        content: string,
        image: ImageReference,
        remoteURL: string
    ): string {
        const isStandardMarkdownImage = image.fullMatch.startsWith('![')
        const hasImagePath = image.fullMatch.includes('](')

        if (isStandardMarkdownImage && hasImagePath) {
            return content.replace(
                image.fullMatch,
                `![${image.altText}](${remoteURL})`
            )
        }

        return content.replace(
            image.fullMatch,
            `![${image.altText}](${remoteURL})`
        )
    }

    private async uploadImageFile(
        imageFile: TFile,
        blogID: string
    ): Promise<string | null> {
        try {
            const imageBuffer = await this.app.vault.readBinary(imageFile)
            const fileExtension = imageFile.extension.toLowerCase()
            const contentType = fileExtension.toContentType()

            const mediaRequest = this.networkRequestFactory.makeMediaUploadRequest(
                imageBuffer,
                imageFile.name,
                contentType,
                blogID
            )

            try {
                const imageURL = await this.networkClient.uploadMedia(mediaRequest)
                return imageURL
            } catch {
                this.delegate?.imageProcessingDidFail(
                    new Error(`Error uploading image: ${imageFile.name}`)
                )

                return null
            }
        } catch {
            this.delegate?.imageProcessingDidFail(
                new Error(`Error reading image: ${imageFile.name}`)
            )

            return null
        }
    }

    private async getImageURLMap(): Promise<Record<string, string>> {
        const imageURLs = this.frontmatterService.retrieveString('image_urls')
        if (!imageURLs) {
            return {}
        }

        try {
            return JSON.parse(imageURLs)
        } catch {
            this.delegate?.imageProcessingDidFail(
                new Error('Error parsing image URLs from Obsidian roperties'),
            )
            return {}
        }
    }

    private async saveImageURL(
        localPath: string,
        remoteURL: string
    ): Promise<void> {
        const imageURLMap = await this.getImageURLMap()
        imageURLMap[localPath] = remoteURL

        try {
            this.frontmatterService.save(
                JSON.stringify(imageURLMap),
                'image_urls'
            )
        } catch {
            this.delegate?.imageProcessingDidFail(
                new Error('Error saving image URL to Obsidian properties')
            )
        }
    }

    private getImageFile(path: string): TFile | null {
        if (path.startsWith('./') || path.startsWith('../') || !path.includes('/')) {
            const currentFile = this.app.workspace.getActiveFile()
            if (currentFile) {
                const currentDir = currentFile.parent?.path || ''
                const resolvedPath = this.resolvePath(currentDir, path)
                return this.getFileByPath(resolvedPath)
            }
        }

        return this.getFileByPath(path)
    }

    private getFileByPath(path: string): TFile | null {
        const file = this.app.vault.getFiles().find((f: TFile) =>
            f.path === path ||
            f.path.endsWith(`/${path}`) ||
            path.endsWith(`/${f.name}`)
        )
        return file || null
    }

    private resolvePath(
        basePath: string,
        relativePath: string
    ): string {
        if (relativePath.startsWith('./')) {
            relativePath = relativePath.substring(2)
        }

        if (relativePath.startsWith('../')) {
            const basePathParts = basePath.split('/')
            basePathParts.pop()
            basePath = basePathParts.join('/')
            relativePath = relativePath.substring(3)
            return this.resolvePath(basePath, relativePath)
        }

        return basePath ? `${basePath}/${relativePath}` : relativePath
    }
}
