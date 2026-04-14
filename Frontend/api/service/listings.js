// import { privateHttpClient } from "../client/privateHttpClient";
import { publicHttpClient } from "../client/publicHttpClient";

class ListingsService {

    getListings() {
        return publicHttpClient.get(`api/property/getAll`);
    }

}

export const listingsService = new ListingsService();