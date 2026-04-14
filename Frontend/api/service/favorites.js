import { privateHttpClient } from "../client/privateHttpClient";

class FavoritesService {

    getFacorites(params) {
        return privateHttpClient.get(`/api/favorite/getAll?${params}`);
    }

}

export const favoritesService = new FavoritesService();