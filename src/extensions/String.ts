declare global {
    export interface String {
        removeFrontmatter(): string
        removeObsidianLinks(): string
        validValues(): string[]
    }
}

String.prototype.removeFrontmatter = function(this: string) {
    const regex = /---\s*[\s\S]*?\s*---/
    return this.replace(regex, '')
}

String.prototype.validValues = function(this: string) {
    return this
        .split(',')
        .filter(value => value.length > 0)
        .map(tag => tag.trim())
}

interface Bounds {
    start: number
    end: number
}

String.prototype.removeObsidianLinks = function (this: string) {
    const linkRegex = /\[\[([^\[\]]+)\]\]/g
    const codeBlockRegex = /```[\s\S]*?```/g
    const inlineCodeRegex = /`[^`]+`/g

    const extractBounds = (regex: RegExp): Bounds[] => {
        const bounds: Bounds[] = []
        let match

        while ((match = regex.exec(this)) !== null) {
            bounds.push({
                start: match.index,
                end: match.index + match[0].length
            })
        }

        return bounds
    }

    const codeBlocksBounds = extractBounds(codeBlockRegex)
    const inlineCodesBounds = extractBounds(inlineCodeRegex)

    const cleanMarkdown = (match: string, content: string, index: number): string => {
        const isInCodeBlock = codeBlocksBounds.some(
            (block) => index >= block.start && index <= block.end
        )
        const isInInlineCode = inlineCodesBounds.some(
            (code) => index >= code.start && index <= code.end
        )

        if (isInCodeBlock || isInInlineCode) {
            return match
        } else {
            return content.includes('|') ? content.split('|')[1] : content
        }
    }

    return this.replace(linkRegex, cleanMarkdown)
}

export { }
