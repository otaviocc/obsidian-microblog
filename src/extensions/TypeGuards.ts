import { PublishViewModel } from '@views/PublishViewModel'
import { UpdateViewModel } from '@views/UpdateViewModel'
import { MarkdownView } from 'obsidian'

// Checks if the type is `PublishViewModel`
export function isPublishViewModel(value: unknown): value is PublishViewModel {
    return typeof value === "object" && value instanceof PublishViewModel
}

// Checks if the type is `UpdateViewModel`
export function isUpdateViewModel(value: unknown): value is UpdateViewModel {
    return typeof value === "object" && value instanceof UpdateViewModel
}

// Checks if the type is `MarkdownView`
export function isMarkdownView(value: unknown): value is MarkdownView {
    return typeof value === "object" && value instanceof MarkdownView
}
