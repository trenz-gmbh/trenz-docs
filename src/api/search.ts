import {SearchResult} from "@/models/SearchResult";
import ApiClient from "@/api/ApiClient";

export default async function (query: string): Promise<Array<SearchResult>> {
    return await ApiClient.getJson(`Search?q=${encodeURIComponent(query)}`);
}