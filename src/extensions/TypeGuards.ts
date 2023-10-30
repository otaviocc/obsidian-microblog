import { PublishPageViewModel } from '@views/PublishPageViewModel'
import { PublishPostViewModel } from '@views/PublishPostViewModel'
import { UpdatePageViewModel } from '@views/UpdatePageViewModel'
import { UpdatePostViewModel } from '@views/UpdatePostViewModel'
import { MarkdownView } from 'obsidian'

// Checks if the type is `PublishPostViewModel`
export function isPublishPostViewModel(value: unknown): value is PublishPostViewModel {
    return typeof value === 'object' && value instanceof PublishPostViewModel
}

// Checks if the type is `PublishPageViewModel`
export function isPublishPageViewModel(value: unknown): value is PublishPageViewModel {
    return typeof value === 'object' && value instanceof PublishPageViewModel
}

// Checks if the type is `UpdatePostViewModel`
export function isUpdatePostViewModel(value: unknown): value is UpdatePostViewModel {
    return typeof value === 'object' && value instanceof UpdatePostViewModel
}

// Checks if the type is `UpdatePageViewModel`
export function isUpdatePageViewModel(value: unknown): value is UpdatePageViewModel {
    return typeof value === 'object' && value instanceof UpdatePageViewModel
}

// Checks if the type is `MarkdownView`
export function isMarkdownView(value: unknown): value is MarkdownView {
    return typeof value === 'object' && value instanceof MarkdownView
}
