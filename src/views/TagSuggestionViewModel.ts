/*
 * Tag Suggestions Delegate Interface, returns to the delegate
 * the category selected by the user.
 */
export interface TagSuggestionDelegate {

    // Triggered when a category is selected.
    didSelectCategory(category: string): void
}

export class TagSuggestionViewModel {

    // Properties

    public tags: Array<string>
    private delegate?: TagSuggestionDelegate

    // Life cycle

    constructor(
        tags: Array<string>,
        delegate?: TagSuggestionDelegate
    ) {
        this.tags = tags
        this.delegate = delegate
    }

    // Public

    public chooseCategory(category: string) {
        this.delegate?.didSelectCategory(category)
        console.log('Category selected: ' + category)
    }
}