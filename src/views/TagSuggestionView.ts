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
        this.viewModel.delegate = this
    }

    // Public

    public async onOpen() {
        await this.viewModel.fetchCategories()
    }

    public getItems(): string[] {
        return this.viewModel.categories
    }

    public getItemText(value: string): string {
        return value
    }

    public onChooseItem(item: string, evt: MouseEvent | KeyboardEvent) {
        console.log('onChooseSuggestion: ' + item)
    }

    // TagSuggestionDelegate

    public fetchCategoriesDidSucceed() {
        this.onOpen()
        console.log('fetchCategoriesDidSucceed')
    }

    public fetchCategoriesDidFail(error: Error) {
        this.onOpen()
        console.log('fetchCategoriesDidFail: ' + error.message)
    }
}