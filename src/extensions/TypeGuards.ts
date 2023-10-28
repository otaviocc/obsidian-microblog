import { PublishPostViewModel } from '@views/PublishPostViewModel'
import { UpdateViewModel } from '@views/UpdateViewModel'
import { MarkdownView } from 'obsidian'

// Checks if the type is `PublishPostViewModel`
export function isPublishPostViewModel(value: unknown): value is PublishPostViewModel {
    return typeof value === 'object' && value instanceof PublishPostViewModel
}

// Checks if the type is `UpdateViewModel`
export function isUpdateViewModel(value: unknown): value is UpdateViewModel {
    return typeof value === 'object' && value instanceof UpdateViewModel
}

// Checks if the type is `MarkdownView`
export function isMarkdownView(value: unknown): value is MarkdownView {
    return typeof value === 'object' && value instanceof MarkdownView
}
