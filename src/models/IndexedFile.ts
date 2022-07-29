import {ContentFile} from "@/models/ContentFile";

export interface IndexedFile extends ContentFile {
    uid: string;
    name: string;
    location: string;
}