import { privateHttpClient } from "../client/privateHttpClient";

class FavoritesService {

    getFacorites(query) {
        const params = query && new URLSearchParams(
            Object.entries(query).map(([key, value]) => [
                key,
                String(value)
            ])
        )

        return privateHttpClient.get(`/api/favorite/getAll?${params}`);
    }

}

export const favoritesService = new FavoritesService();