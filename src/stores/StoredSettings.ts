/*
MIT License

Copyright (c) 2022 Otavio C.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
 * Plugin settings.
 */
export interface StoredSettings {

    // Application token used to access Micro.blog.
    appToken: string

    // Property name, in the frontmatter, used to store the categories of a post.
    categoriesPropertyName: string

    // Property name, in the frontmatter, used to store the summary of a post or page.
    summaryPropertyName: string

    // Default Categories (set in Settings) that applies
    // to all new posts.
    defaultTags: string

    // Default post visibility (set in Settings)
    // that applies to all new posts.
    postVisibility: string

    // List of blogs available for the given app token.
    blogs: Record<string, string>

    // Default blog used for new posts.
    selectedBlogID: string

    // List of synchronized categories used for suggestions
    // in new posts.
    synchronizedCategories: Record<string, string[]>

    // Boolean indicating if pages should be added
    // to the blog navigation.
    includePagesInNavigation: boolean

    // Boolean indicating if the plugin should synchronize
    // the list of categories when Obsidian opens.
    synchronizeCategoriesOnOpen: boolean
}

// Default values for the plugin.
export const defaultSettings: StoredSettings = {
    appToken: '',
    categoriesPropertyName: 'tags',
    summaryPropertyName: 'summary',
    defaultTags: '',
    postVisibility: 'draft',
    blogs: {},
    selectedBlogID: 'default',
    synchronizedCategories: {},
    includePagesInNavigation: false,
    synchronizeCategoriesOnOpen: true
}
