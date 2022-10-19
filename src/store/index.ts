import {createStore} from 'vuex'
import {State} from "@/store/State";
import {IndexedFile} from "@/models/IndexedFile";
import {SearchResult} from "@/models/SearchResult";
import {NavTree} from "@/models/NavTree";
import * as api from "@/api";
import ApiClient, {ApiError} from "@/api/ApiClient";
import IndexStats from "@/models/IndexStats";
import {NavNode} from "@/models/NavNode";
import {WebappSettings} from "@/WebappSettings";

function replaceApiHost(content: string): string {
    return content.replaceAll("%API_HOST%", ApiClient.getBaseUrl()?.slice(0, -1) ?? "/api");
}

export default createStore({
    state: {
        settings: null,
        navTree: {root: {}, containsUnauthorizedChildren: false},
        searchQuery: '',
        searchResults: [],
        searchResultMessage: null,
        stats: null,
        documents: new Map(),
    } as State,
    getters: {
        navTreeHasHiddenNodes(state: State): boolean {
            const recurseChildren = (children: Record<string, NavNode>): boolean => {
                for (const child of Object.values(children)) {
                    if (child.containsUnauthorizedChildren) {
                        return true;
                    }

                    if (typeof child.children === 'undefined') {
                        continue;
                    }

                    if (recurseChildren(child.children)) {
                        return true;
                    }
                }
                return false;
            }

            return state.navTree.containsUnauthorizedChildren || recurseChildren(state.navTree.root);
        }
    },
    mutations: {
        setNavTree(state: State, navTree: NavTree) {
            state.navTree = navTree;
        },

        setSearchQuery(state: State, searchQuery: string) {
            state.searchQuery = searchQuery;
        },

        setSearchResults(state: State, {results, message}: { results: SearchResult[], message: string | null }) {
            state.searchResults = results;
            state.searchResultMessage = message;
        },

        putDocument(state: State, document: IndexedFile) {
            state.documents.set(document.location, document);
        },

        setStats(state: State, stats: IndexStats | null) {
            state.stats = stats;
        },

        setSettings(state: State, settings: WebappSettings | null) {
            state.settings = settings;
        }
    },
    actions: {
        async loadNavTree({commit}) {
            commit('setNavTree', await api.documents.navTree());
        },

        async loadWebAppSettings({commit, dispatch}): Promise<WebappSettings> {
            ApiClient.setBaseUrl(window.location.origin)
            const settings: WebappSettings = await ApiClient.getJson('webapp-settings.json');

            commit('setSettings', settings);
            await dispatch('applyWebAppSettings');

            return settings;
        },

        async applyWebAppSettings({state}) {
            const settings = state.settings
            if (!settings) return

            const baseUrl = settings.api.baseUrl
            if (typeof baseUrl === 'undefined') {
                alert('Please add a webapp-settings.json file to the content root.')

                throw new Error('API base url is not set')
            } else {
                ApiClient.setBaseUrl(baseUrl)
            }

            if (settings.useAuth) {
                ApiClient.useAuth = true
            }

            const themedElements = document.querySelectorAll<HTMLElement>('.v-theme--light, .v-theme--dark')

            const newPrimary = settings.theme.primary
            if (newPrimary) {
                themedElements.forEach(element => element.style.setProperty('--v-theme-primary', newPrimary))

                let themeColorTag = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
                if (!themeColorTag) {
                    themeColorTag = document.createElement('meta')
                    themeColorTag.setAttribute('name', 'theme-color')
                    document.head.insertAdjacentElement("beforeend", themeColorTag)
                }
                themeColorTag.setAttribute('content', `rgb(${newPrimary})`)
            }

            const newOnPrimary = settings.theme["primary-foreground"]
            if (newOnPrimary) {
                themedElements.forEach(element => element.style.setProperty('--v-theme-on-primary', newOnPrimary))
            }
        },

        async search({commit}, query: string) {
            // update stats async, don't wait for it
            api.search.stats().then(stats => commit('setStats', stats));

            await commit('setSearchQuery', query);

            if (query.length === 0) {
                commit('setSearchResults', {
                    results: [],
                    message: "Search for something. Your results will be shown here."
                });

                return;
            }

            try {
                const results = await api.search.query(query);

                commit('setSearchResults', {
                    results: results.map(doc => {
                        doc.content = replaceApiHost(doc.content);
                        doc._formatted.content = replaceApiHost(doc._formatted.content);

                        return doc;
                    }),
                    message: results.length === 0 ? "No results found." : null
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
            let doc: IndexedFile | null = null;
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
