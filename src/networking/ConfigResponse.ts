/*
 * Response of the `/micropub?q=config` network request.
 */
export type ConfigResponse = {
	destination?: Array<ConfigDestinationResponse>
}

export type ConfigDestinationResponse = {
    uid: string
    name: string
}