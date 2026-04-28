import useSWR from "swr";
import { listingsService } from "../../service/listings";

export function useListings(query) {

	const queryParams = query && Object.fromEntries(
		Object.entries(query).filter(([, value]) => Boolean(value))
	);

	return useSWR(["listings"], () => listingsService.getListings(queryParams));
}
