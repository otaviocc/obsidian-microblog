/*
 * Tag Suggestion Delegate Interface, returns to the delegate
 * the category selected by the user.
 */
export interface TagSuggestionDelegate {

    // Triggered when a category is selected.
    tagSuggestionDidSelectTag(tag: string): void
}

/*
 * This view model drives the content and interactions with the
 * Tag Suggestion view.
 */
export class TagSuggestionViewModel {

    // Properties

    public tags: Array<string>
    public delegate?: TagSuggestionDelegate

    // Life cycle

    constructor(
        tags: Array<string>
    ) {
        this.tags = tags
    }

    // Public

    public chooseCategory(tag: string) {
        this.delegate?.tagSuggestionDidSelectTag(tag)
        console.log('Category selected: ' + tag)
    }
}