import { TagSuggestionViewModel } from '@views/TagSuggestionViewModel'
import { App, FuzzySuggestModal } from 'obsidian'

/*
 * `TagSuggestionsView` subclasses `FuzzySuggestModal`, and is presented from
 * the Publish view.
 *
 * The data used to populate this view and all the interaction with the
 * view is handled by the view's view model.
 */
export class TagSuggestionView extends FuzzySuggestModal<string> {

    // Properties

    private viewModel: TagSuggestionViewModel

    // Life cycle

    constructor(
        viewModel: TagSuggestionViewModel,
        app: App
    ) {
        super(app)

        this.viewModel = viewModel
    }

    // Public

    public onOpen() {
        super.onOpen()

        this.setPlaceholder(
            this.viewModel.placeholderText
        )

        this.setInstructions([
            { command: '', purpose: this.viewModel.instructionsText }
        ])
    }

    public getItems(): string[] {
        return this.viewModel.tags
    }

    public getItemText(
        value: string
    ): string {
        return value
    }

    public onChooseItem(
        item: string,
        _evt: MouseEvent | KeyboardEvent
    ) {
        this.viewModel.chooseCategory(item)
    }
}
