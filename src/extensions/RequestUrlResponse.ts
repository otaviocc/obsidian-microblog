import { RequestUrlResponse } from 'obsidian'

declare global {
    interface Object {
        readonly ok: boolean
    }
}

Object.defineProperty(Object.prototype, 'ok', {
    get: function (this: RequestUrlResponse) {
        if (this.status === undefined) {
            return false
        }
        return this.status >= 200 && this.status < 300
    },
    configurable: true,
    enumerable: false
})

export { }
