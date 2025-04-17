import { Component } from 'obsidian'

/**
 * A reusable component for displaying status messages in the UI
 */
export class Status extends Component {

    // Properties

    private statusElement: HTMLElement

    // Life cycle

    constructor(
        containerEl: HTMLElement,
        initialMessage?: string
    ) {
        super()

        this.statusElement = containerEl.createDiv('status-message')
        this.statusElement.addClass('micro-status')

        this.statusElement.style.marginTop = '8px'
        this.statusElement.style.padding = '6px 10px'
        this.statusElement.style.backgroundColor = 'var(--background-secondary)'
        this.statusElement.style.borderRadius = '4px'
        this.statusElement.style.fontSize = '0.9em'

        if (initialMessage) {
            this.setMessage(initialMessage)
        } else {
            this.statusElement.hide()
        }
    }

    // Public

    public setMessage(message: string): void {
        this.statusElement.setText(message)
        this.statusElement.show()
    }

    public hide(): void {
        this.statusElement.hide()
    }

    public show(): void {
        this.statusElement.show()
    }

    public clear(): void {
        this.statusElement.setText('')
        this.hide()
    }
}
