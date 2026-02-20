import axios from "axios";

let accessToken = null;
let accessTokenExp = 0;

export function setAccessToken(token) {
    accessToken = token;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        accessTokenExp = payload.exp * 1000
    } catch (e) {
        console.log(e);
        accessTokenExp = 0;
    }
}

export function getAccessToken() {
    return accessToken;
}

let refreshPromise = null;

async function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
            {},
            {
                withCredentials: true
            }
        )
        .then((res) => {
            setAccessToken(res.data.accessToken);
            return res.data.accessToken;
        })
        .finally(() => {
            refreshPromise = null;
        })
    }

    return refreshPromise;
}

export function isExpired() {
    return Date.now() >= accessTokenExp - 2000;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

api.interceptors.request.use(
    async (config) => {
        if (accessToken && isExpired()) {
            await refreshAccessToken();
        }

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (err) => Promise.reject(err)
);

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config;
        // const original = err.original;
        
        if ( err.response?.status === 401 &&
            !original._retry
        ) {
            original._retry = true;

            try {
                await refreshAccessToken();
                original.headers.Authorization = `Bearer ${getAccessToken()}`
                return api(original);
            } catch (err) {
                console.log("Failed to refresh, Logging out...");
                return Promise.reject(err);
            }
        }

        return Promise.reject(err);
    } 
)


export default api;