declare global {
    export interface String {
        removeFrontmatter(): string
    }
}

String.prototype.removeFrontmatter = function(): string {
    const frontmatterRegularExpression = /---\s*[\s\S]*?\s*---/g
    return this.replace(frontmatterRegularExpression, "")
}

export { }
