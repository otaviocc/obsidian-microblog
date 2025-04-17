import { RequestUrlResponse } from 'obsidian'

declare global {
    interface Object {
        isOk(): boolean
    }
}

Object.prototype.isOk = function (this: RequestUrlResponse) {
    if (this.status === undefined) {
        return false
    }

    return this.status >= 200 && this.status < 300
}

export { }
