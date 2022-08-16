export interface NavNode {
    uid: string;
    order: number;
    location: string;
    nodeName: string;
    hasContent: boolean;
    containsUnauthorizedChildren: boolean;
    children?: Record<string, NavNode>;
}
