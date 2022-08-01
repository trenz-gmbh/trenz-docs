import {IndexedFile} from "@/models/IndexedFile";
import {NavTree} from "@/models/NavTree";
import {SearchResult} from "@/models/SearchResult";
import IndexStats from "@/models/IndexStats";

export interface State {
    navTree: NavTree;
    searchQuery: string;
    searchResults: Array<SearchResult>;
    searchResultMessage: string|null;
    stats: IndexStats|null;
    documents: Map<string, IndexedFile>;
}