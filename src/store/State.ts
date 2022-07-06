export type NavTree = Map<string, NavNode>;

export interface NavNode {
    uid: string;
    name: string;
    location: string,
    children: NavTree;
}

export interface State {
    navTree: NavTree;
}