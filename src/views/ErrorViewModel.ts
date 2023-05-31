/*
 * This view model drives the content and interactions with the
 * error view.
 */
export class ErrorViewModel {

    // Properties

    readonly title: string
    readonly message: string

    // Life cycle

    constructor(
        title: string,
        message: string
    ) {
        this.title = title
        this.message = message
    }
}