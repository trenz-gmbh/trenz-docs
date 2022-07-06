import {createStore} from 'vuex'
import {MeiliSearch} from "meilisearch";
import {NavTree, State} from "@/store/State";

export default createStore({
    state: {
        navTree: new Map(),
    } as State,
    getters: {},
    mutations: {
        setNavTree(state, navTree) {
            state.navTree = navTree;
        }
    },
    actions: {
        async loadNavTree({commit}) {
            const client = new MeiliSearch({
                host: 'http://localhost:7700',
                apiKey: 'masterKey',
            })

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
                        });
                    }
                    const child = node.get(part);
                    if (child) {
                        node = child.children;
                    }
                }
            }

            commit('setNavTree', tree)
        },
    }
})
