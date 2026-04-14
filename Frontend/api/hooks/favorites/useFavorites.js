import useSWR from "swr";
import { favoritesService } from "../../service/favorites";

export function useFavorites() {
    return useSWR(
        ["favorites"],
        () => favoritesService.getFacorites()
    )
}