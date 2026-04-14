import useSWR from "swr";
import { listingsService } from "../../service/listings";

export function useListings() {
	return useSWR(["listings"], () => listingsService.getListings());
}
