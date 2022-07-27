import {NavTree} from "@/models/NavTree";

export interface NavNode {
    uid: string;
    order: number;
    location: string;
    nodeName: string;
    hasContent: boolean;
    children?: NavTree;
}
