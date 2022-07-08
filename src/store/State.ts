export type NavTree = Map<string, NavNode>;

export interface NavNode extends Omit<Document, 'content'>{
    children: NavTree;
}

export interface Document {
    uid: string;
    name: string;
    location: string;
    content: string;
    order: number;
}

export interface SearchResult extends Omit<Document, 'uid'|'order'> {
    _formatted: Omit<SearchResult, '_formatted'>;
}

export interface State {
    navTree: NavTree;
    searchQuery: string;
    searchResults: Array<SearchResult>
}