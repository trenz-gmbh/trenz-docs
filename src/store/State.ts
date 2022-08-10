import {IndexedFile} from "@/models/IndexedFile";
import {NavTree} from "@/models/NavTree";
import IndexStats from "@/models/IndexStats";
import {SearchResults} from "@/models/SearchResults";

export interface State {
    navTree: NavTree;
    search: {
        message: string|null;
        query: string;
        offset: number;
        results: SearchResults|null;
    };
    stats: IndexStats|null;
    documents: Map<string, IndexedFile>;
}