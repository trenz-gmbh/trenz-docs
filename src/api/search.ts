import {SearchResult} from "@/models/SearchResult";
import ApiClient from "@/api/ApiClient";
import IndexStats from "@/models/IndexStats";

export default {
    async query(query: string): Promise<Array<SearchResult>> {
        return await ApiClient.getJson(`Search/Query?q=${encodeURIComponent(query)}`);
    },

    async stats(): Promise<IndexStats> {
        return await ApiClient.getJson("Search/Stats");
    }
}