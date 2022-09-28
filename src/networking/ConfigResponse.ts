/*
 * Response of the `/micropub?q=config` network request.
 */
export type ConfigResponse = {
	destination?: [ConfigDestinationResponse]
}

export type ConfigDestinationResponse = {
    uid: string
    name: string
}