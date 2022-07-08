import {IndexedFile} from "@/models/IndexedFile";
import ApiClient from "@/api/ApiClient";

export default {
    async all(): Promise<Array<IndexedFile>> {
        return ApiClient.getJson('Documents/All');
    },

    async byLocation(location: string): Promise<IndexedFile|null> {
        return ApiClient.getJson(`Documents/ByLocation/${location}`);
    }
}
