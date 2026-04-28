import { privateHttpClient } from "../client/privateHttpClient";
import { publicHttpClient } from "../client/publicHttpClient";

class AuthService {

    refresh() {
        return publicHttpClient.post('/auth/refresh');
    }

    currentUser() {
        return privateHttpClient.get(`/api/users/current`);
    }

}

export const authService = new AuthService();