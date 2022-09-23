export type ConfigResponse = {
	destination?: [ConfigDestinationResponse]
}

export type ConfigDestinationResponse = {
    uid: string
    name: string
}