// import { privateHttpClient } from "../client/privateHttpClient";
import { publicHttpClient } from "../client/publicHttpClient";

class ListingsService {

    getLoisting(id) {
        return publicHttpClient.get(`api/property/${id}/details`)
    }

    getListings(query) {

        const params = query && new URLSearchParams(
            Object.entries(query).map(([key, value]) => [
                key, 
                String(value)
            ])
        )

        return publicHttpClient.get(`api/property/getAll?${params}`);
    }

}

export const listingsService = new ListingsService();