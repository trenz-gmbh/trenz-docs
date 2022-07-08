import {IndexedFile} from "@/models/IndexedFile";

export interface SearchResult extends Omit<IndexedFile, 'uid' | 'order'> {
    _formatted: Omit<SearchResult, '_formatted'>;
}