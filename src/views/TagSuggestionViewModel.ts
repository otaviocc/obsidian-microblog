import { NetworkClientInterface } from '@networking/NetworkClient'
import { NetworkRequestFactoryInterface } from '@networking/NetworkRequestFactory'
import { CategoriesResponse } from '@networking/CategoriesResponse'

export interface TagSuggestionDelegate {
    fetchCategoriesDidSucceed(): void
    fetchCategoriesDidFail(error: Error): void
}

export class TagSuggestionViewModel {

    // Properties

    public delegate?: TagSuggestionDelegate
    private networkClient: NetworkClientInterface
    private networkRequestFactory: NetworkRequestFactoryInterface
    public categories = new Array<string>()

    // Life cycle

    constructor(
        networkClient: NetworkClientInterface,
        networkRequestFactory: NetworkRequestFactoryInterface
    ) {
        this.networkClient = networkClient
        this.networkRequestFactory = networkRequestFactory
    }

    // Public

    public async fetchCategories() {
        if (this.categories.length > 0) {
            console.log('No need to refetch')
            return
        }

        await this.networkClient
            .run<CategoriesResponse>(
                this.networkRequestFactory.makeCategoriesRequest()
            )
            .then(value => {
                this.categories = value.categories
                this.delegate?.fetchCategoriesDidSucceed()
                console.log('Fetch categories successful')
                console.log('categories: ' + JSON.stringify(value))
            })
            .catch(error => {
                this.delegate?.fetchCategoriesDidFail(error)
                console.log('Fetch categories failure')
            })
    }
}