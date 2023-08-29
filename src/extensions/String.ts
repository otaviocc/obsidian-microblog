declare global {
    export interface String {
        removeFrontmatter(): string
    }
}

String.prototype.removeFrontmatter = function(): string {
    const regex = /---\s*[\s\S]*?\s*---/
    return this.replace(regex, "")
}

export { }
