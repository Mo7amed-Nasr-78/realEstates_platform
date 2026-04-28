import useSWR from "swr";
import { listingsService } from "../../service/listings";

export function useListing(id) {
    return useSWR(
        ['listing'],
        () => listingsService.getLoisting(id)
    )
}