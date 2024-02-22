declare global {
    export interface String {
        removeFrontmatter(): string
        flatSplit(): string[]
    }
}

String.prototype.removeFrontmatter = function(this: string) {
    const regex = /---\s*[\s\S]*?\s*---/
    return this.replace(regex, '')
}

String.prototype.flatSplit = function(this: string) {
    return this
        .split(',')
        .filter(value => value.length > 0)
        .map(tag => tag.trim())
}

export { }
