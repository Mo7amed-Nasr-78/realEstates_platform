import axios from "axios";

class PublicHttpClient {
    instance;

    constructor() {
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_BACKEND_URL,
            withCredentials: true
        })
    }

    get(url) {
        return this.instance.get(url);
    }

    post(url, data) {
        return this.instance.post(url, data);
    } 

    put(url, data) {
        return this.instance.put(url, data);
    }

    delete(url) {
        return this.instance.delete(url);
    }
}

export const publicHttpClient = new PublicHttpClient();