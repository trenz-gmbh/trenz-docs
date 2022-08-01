import ApiClient from "@/api/ApiClient";
import IndexStats from "@/models/IndexStats";
import {SearchResults} from "@/models/SearchResults";

export default {
    async query(query: string, limit?: number, offset?: number): Promise<SearchResults> {
        let url = `Search/Query?q=${encodeURIComponent(query)}`;

        if (limit !== undefined)
            url += `&limit=${limit}`;

        if (offset !== undefined)
            url += `&offset=${offset}`;

        return await ApiClient.getJson(url);
    },

    async stats(): Promise<IndexStats> {
        return await ApiClient.getJson("Search/Stats");
    }
}