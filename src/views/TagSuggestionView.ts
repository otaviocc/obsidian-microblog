import { FuzzySuggestModal } from 'obsidian'
import { TagSuggestionViewModel } from '@views/TagSuggestionViewModel'

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

    public getItems(): string[] {
        return this.viewModel.tags
    }

    public getItemText(value: string): string {
        return value
    }

    public onChooseItem(item: string, evt: MouseEvent | KeyboardEvent) {
        this.viewModel.chooseCategory(item)
    }
}