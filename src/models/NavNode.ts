export interface NavNode {
    uid: string;
    order: number;
    location: string;
    nodeName: string;
    hasContent: boolean;
    hasHiddenChildren: boolean;
    children?: Record<string, NavNode>;
}
