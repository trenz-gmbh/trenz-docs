import {createStore} from 'vuex'
import {State} from "@/store/State";
import {IndexedFile} from "@/models/IndexedFile";
import {NavTree} from "@/models/NavTree";
import * as api from "@/api";
import ApiClient, {ApiError} from "@/api/ApiClient";
import IndexStats from "@/models/IndexStats";
import {SearchResults} from "@/models/SearchResults";

function replaceApiHost(content: string): string {
    return content.replaceAll("%API_HOST%", ApiClient.getBaseUrl()?.slice(0, -1) ?? "/api");
}

export default createStore({
    state: {
        navTree: {},
        search: {
            message: null,
            query: "",
            offset: 0,
            results: null,
        },
        stats: null,
        documents: new Map(),
    } as State,
    getters: {},
    mutations: {
        setNavTree(state: State, navTree: NavTree) {
            state.navTree = navTree;
        },

        setSearchQuery(state: State, {query, offset}: {query: string, offset: number}) {
            state.search.query = query;
            state.search.offset = offset;
        },

        setSearchResults(state: State, {results, message}: {results: SearchResults|null, message: string|null}) {
            state.search.results = results;
            state.search.message = message;
        },

        putDocument(state: State, document: IndexedFile) {
            state.documents.set(document.location, document);
        },

        setStats(state: State, stats: IndexStats|null) {
            state.stats = stats;
        },
    },
    actions: {
        async loadNavTree({commit}) {
            commit('setNavTree', await api.documents.navTree());
        },

        async search({commit}, {query, offset, limit}: {query: string, offset: number, limit: number}) {
            // update stats async, don't wait for it
            api.search.stats().then(stats => commit('setStats', stats));

            await commit('setSearchQuery', {query, offset});

            if (query.length === 0) {
                commit('setSearchResults', {results: null, message: null});

                return;
            }

            try {
                const results = await api.search.query(query, limit, offset);

                results.hits = results.hits.map(doc => {
                    doc.content = replaceApiHost(doc.content);
                    doc._formatted.content = replaceApiHost(doc._formatted.content);

                    return doc;
                });

                commit('setSearchResults', {
                    results: results,
                    message: results.hits.length === 0 ? "No results found." : null
                });
            } catch (e: unknown) {
                let message = "An unknown error occurred.";
                if (e instanceof Error) {
                    message = "The following error occurred: " + e.message;
                    console.error(e);
                }

                commit('setSearchResults', {results: null, message});
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

            const notFoundText = "This page does not exist.";

            try {
                doc = await api.documents.byLocation(location);
            } catch (e) {
                console.error(e);

                if (e instanceof ApiError) {
                    switch (e.response.status) {
                        case 404:
                            throw notFoundText;
                        case 500:
                            throw "The server encountered an error. Please try again later.";
                        case 503:
                            throw "The server is currently unavailable. Please try again later.";
                        default:
                            break;
                    }
                } else if (e instanceof TypeError) {
                    if (e.message === "Failed to fetch") {
                        throw "The server is currently unavailable. Please try again later.";
                    }
                }

                throw "An unexpected error occurred while loading the document. Please try again later.";
            }

            if (doc === null) {
                return notFoundText;
            }

            doc.content = replaceApiHost(doc.content);

            commit('putDocument', doc);

            return doc.content;
        }
    }
})
