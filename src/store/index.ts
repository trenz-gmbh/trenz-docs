import {createStore} from 'vuex'
import {MeiliSearch} from "meilisearch";
import {NavNode, NavTree, State} from "@/store/State";

const client = new MeiliSearch({
    host: 'http://localhost:7700',
    apiKey: 'masterKey',
})

export default createStore({
    state: {
        navTree: new Map(),
        searchQuery: '',
        searchResults: [],
    } as State,
    getters: {},
    mutations: {
        setNavTree(state, navTree) {
            state.navTree = navTree;
        },

        setSearchQuery(state, searchQuery) {
            state.searchQuery = searchQuery;
        },

        setSearchResults(state, searchResults) {
            state.searchResults = searchResults;
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
                            name: doc.name,
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

        async search({commit}, query) {
            await commit('setSearchQuery', query);

            if (query.length === 0) {
                commit('setSearchResults', []);

                return;
            }

            const results = await client.index('files').search(query, {
                attributesToHighlight: ['name', 'location', 'content'],
                highlightPreTag: '<mark>',
                highlightPostTag: '</mark>',
                attributesToCrop: ['content'],
                cropLength: 10,
                attributesToRetrieve: ['name', 'location', 'content'],
                //matches: true,
            });

            commit('setSearchResults', results.hits);
        }
    }
})
