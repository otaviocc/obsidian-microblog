import { PublishViewModel } from '@views/PublishViewModel'
import { UpdateViewModel } from '@views/UpdateViewModel'
import { MarkdownView } from 'obsidian'

export function isPublishViewModel(value: unknown): value is PublishViewModel {
    return typeof value === "object" && value instanceof PublishViewModel
}

export function isUpdateViewModel(value: unknown): value is UpdateViewModel {
    return typeof value === "object" && value instanceof UpdateViewModel
}

export function isMarkdownView(value: unknown): value is MarkdownView {
    return typeof value === "object" && value instanceof MarkdownView
}
