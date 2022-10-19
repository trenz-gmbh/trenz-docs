import {IndexedFile} from "@/models/IndexedFile";
import {NavTree} from "@/models/NavTree";
import {SearchResult} from "@/models/SearchResult";
import IndexStats from "@/models/IndexStats";
import {WebappSettings} from "@/WebappSettings";

export interface State {
    settings: WebappSettings | null,
    navTree: NavTree;
    searchQuery: string;
    searchResults: Array<SearchResult>;
    searchResultMessage: string | null;
    stats: IndexStats | null;
    documents: Map<string, IndexedFile>;
}
