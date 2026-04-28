import useSWRMutation from "swr/mutation";
import { authService } from "../../service/auth";

export function useCurrentUser() {
    return useSWRMutation(
        ['currentUser'],
        () => authService.currentUser()
    )
}