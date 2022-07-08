import {createStore} from 'vuex'
import {State} from "@/store/State";
import {NavNode} from "@/models/NavNode";
import {IndexedFile} from "@/models/IndexedFile";
import {SearchResult} from "@/models/SearchResult";
import {NavTree} from "@/models/NavTree";
import * as api from "@/api";

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

        putDocument(state: State, document: IndexedFile) {
            state.documents.set(document.location, document);
        }
    },
    actions: {
        async loadNavTree({commit}) {
            // TODO: replace all() with getNavTree()
            const docs = await api.documents.all();
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
                const results = await api.search(query);

                commit('setSearchResults', {
                    results: results,
                    message: results.length === 0 ? 'No results found.' : null
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
            let doc: IndexedFile|null = null;
            if (state.documents.has(location)) {
                doc = state.documents.get(location) || null;
                if (doc) {
                    return doc.content;
                }
            }

            doc = await api.documents.byLocation(location);
            if (!doc) {
                return "# Not found\r\n\r\nThis page does not exist.";
            }

            commit('putDocument', doc);

            return doc.content;
        }
    }
})
