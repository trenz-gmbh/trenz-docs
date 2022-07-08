import {createStore} from 'vuex'
import {MeiliSearch} from "meilisearch";
import {Document, NavNode, NavTree, SearchResult, State} from "@/store/State";

const client = new MeiliSearch({
    host: 'http://localhost:7700',
    apiKey: 'masterKey',
})

export default createStore({
    state: {
        navTree: new Map(),
        searchQuery: '',
        searchResults: [],
        searchResultMessage: null,
        documents: new Map(),
    } as State,
    getters: {},
    mutations: {
        setNavTree(state: State, navTree: NavTree) {
            state.navTree = navTree;
        },

        setSearchQuery(state: State, searchQuery: string) {
            state.searchQuery = searchQuery;
        },

        setSearchResults(state: State, {results, message}: {results: SearchResult[], message: string|null}) {
            state.searchResults = results;
            state.searchResultMessage = message;
        },

        putDocument(state: State, document: Document) {
            state.documents.set(document.location, document);
        }
    },
    actions: {
        async loadNavTree({commit}) {
            const docs = await client.index('files').getDocuments({
                limit: 10000,
                attributesToRetrieve: ['location', 'name', 'uid'],
            });
            const tree: NavTree = new Map();
            for (const doc of docs) {
                const path = doc.location.split('/');
                const currentPath = [];
                let node = tree;
                for (const part of path) {
                    currentPath.push(part);
                    if (!node.has(part)) {
                        node.set(part, {
                            uid: doc.uid,
                            name: part,
                            location: currentPath.join('/'),
                            children: new Map(),
                        } as NavNode);
                    }
                    const child = node.get(part);
                    if (child) {
                        node = child.children;
                    }
                }
            }

            commit('setNavTree', tree)
        },

        async search({commit}, query: string) {
            await commit('setSearchQuery', query);

            if (query.length === 0) {
                commit('setSearchResults', {results: [], message: "Search for something. Your results will be shown here."});

                return;
            }

            try {
                const results = await client.index('files').search(query, {
                    attributesToHighlight: ['name', 'location', 'content'],
                    highlightPreTag: '<mark>',
                    highlightPostTag: '</mark>',
                    attributesToCrop: ['content'],
                    cropLength: 15,
                    attributesToRetrieve: ['name', 'location', 'content'],
                    //matches: true,
                });

                commit('setSearchResults', {
                    results: results.hits,
                    message: results.hits.length === 0 ? 'No results found.' : null
                });
            } catch (e: unknown) {
                let message = "An unknown error occurred.";
                if (e instanceof Error) {
                    message = "The following error occurred: " + e.message;
                    console.error(e);
                }

                commit('setSearchResults', {results: [], message});
            }
        },

        async findDocumentByLocation({state, commit}, location: string): Promise<string> {
            if (state.documents.has(location)) {
                const doc = state.documents.get(location);
                if (doc) {
                    return doc.content;
                }
            }

            const docs = await client.index('files').search("", {
                filter: 'location = "' + location + '"',
                limit: 1,
            });

            if (docs.hits.length != 1) {
                return "# Not found\r\n\r\nThis page does not exist.";
            }

            const doc = docs.hits[0] as Document;

            commit('putDocument', doc);

            return doc.content;
        }
    }
})
