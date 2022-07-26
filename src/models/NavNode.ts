import {NavTree} from "@/models/NavTree";

export interface NavNode {
    uid: string;
    order: number;
    location: string;
    nodeName: string;
    children?: NavTree;
}
