import useSWRMutation from "swr/mutation";
import { authService } from "../../service/auth";

export function useRefresh() {
    return useSWRMutation(
        ["refresh"],
        () => authService.refresh()
    )
}