import {SearchResult} from "@/models/SearchResult";

export interface SearchResults {
  totalHits: number;
  processingTimeMs: number;
  hits: SearchResult[];
  limit: number;
  offset: number;
}