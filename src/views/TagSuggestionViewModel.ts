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

    public delegate?: TagSuggestionDelegate
    public tags: Array<string>

    // Life cycle

    constructor(
        tags: Array<string>
    ) {
        this.tags = tags
    }

    // Public

    public chooseCategory(category: string) {
        this.delegate?.didSelectCategory(category)
        console.log('Category selected: ' + category)
    }
}