declare global {
    export interface String {
        removeFrontmatter(): string
    }
}

String.prototype.removeFrontmatter = function() {
    const regex = /---\s*[\s\S]*?\s*---/
    return this.replace(regex, "")
}

export { }
