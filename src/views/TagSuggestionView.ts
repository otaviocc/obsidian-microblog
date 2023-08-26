import { FuzzySuggestModal } from 'obsidian'
import { TagSuggestionViewModel } from '@views/TagSuggestionViewModel'

/*
 * Tag Suggestions View subclasses FuzzySuggestModal, and is presented from
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
        viewModel: TagSuggestionViewModel
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

    public getItems(): Array<string> {
        return this.viewModel.tags
    }

    public getItemText(value: string): string {
        return value
    }

    public onChooseItem(
        item: string,
        evt: MouseEvent | KeyboardEvent
    ) {
        this.viewModel.chooseCategory(item)
    }
}
