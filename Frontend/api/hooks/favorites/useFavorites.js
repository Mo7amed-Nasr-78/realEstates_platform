import useSWR from "swr";
import { favoritesService } from "../../service/favorites";

export function useFavorites(query) {
    const queryParams = query && Object.fromEntries(
        Object.entries(query).filter(([, value]) => Boolean(value))
    );

    return useSWR(
        ["favorites", query],
        () => favoritesService.getFacorites(queryParams)
    )
}