import axios from "axios";

class PrivateHttpClient {
	instance;
	accessToken;
	accessTokenExp;
	refreshPromise;
	logoutCallback;

	constructor() {
		this.instance = axios.create({
			baseURL: import.meta.env.VITE_BACKEND_URL,
			withCredentials: true,
		});

		this.setupInterceptors();
	}

	// Authorization setup
	isExpired() {
		return Date.now() >= this.accessTokenExp * 1000 - 10000;
	}

	setAccessToken(token) {
		this.accessToken = token;

		try {
			const { exp } = JSON.parse(
				atob(this.accessToken.split(".")[1]),
			);
			this.accessTokenExp = exp;
		} catch (err) {
			console.log(err);
			this.accessTokenExp = 0;
		}
	}

	getAccessToken() {
		return this.accessToken;
	}

	async refreshAccessToken() {
		if (this.refreshPromise) return this.refreshPromise;

		let attempts = 0;
		const maxAttempts = 3;
		const baseDelay = 1000;

		while (attempts < maxAttempts) {
			try {
				this.refreshPromise = axios
					.post(
						`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
						{},
						{
							withCredentials: true,
						},
					)
					.then((res) => {
						this.setAccessToken(res.data);
						return res.data;
					});
				return await this.refreshPromise;
			} catch (err) {
				attempts++;
				if (attempts >= maxAttempts) {
					this.logoutCallback?.();
					throw err;
				}
				const delay = baseDelay * Math.pow(2, attempts - 1);
				await new Promise((resolve) =>
					setTimeout(() => {
						resolve;
					}, delay),
				);
			} finally {
				this.refreshPromise = null;
			}
		}
	}

	setupInterceptors() {
		// Request Interceptor
		this.instance.interceptors.request.use(
			async (config) => {
				if (!this.accessToken || this.isExpired()) {
					await this.refreshAccessToken();
				}

				if (this.accessToken) {
					config.headers.Authorization = `Bearer ${this.accessToken}`;
				}

				return config;
			},
			(err) => err,
		);

		// Response interceptor
		this.instance.interceptors.response.use(
			(res) => res,
			async (err) => {
				const original = err.config;

				if (err.response.status === 401 && !original._retry) {
					original._retry = true;

					try {
						await this.refreshAccessToken();
						original.headers.Authorization = `Bearer ${this.accessToken}`;
						return this.instance(original);
					} catch (err) {
						console.log(
							"Failed to refresh, Logging out...",
						);
						this.logoutCallback?.();
						return Promise.reject(err);
					}
				}

				return err;
			},
		);
	}

	setLogoutCallback(callback) {
		this.logoutCallback = callback;
	}

	// Request actions
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

export const privateHttpClient = new PrivateHttpClient();
