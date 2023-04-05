/*
 * Response of the `/micropub?h=entry...` network request.
 */
export type PublishResponse = {
	url: string
	preview: string
	edit: string
}