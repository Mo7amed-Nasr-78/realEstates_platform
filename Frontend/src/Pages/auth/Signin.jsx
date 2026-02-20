import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useProps } from "../../components/PropsProvider";
import Alert from "../../components/Alert";
import Loader from "../../components/Loader";
import { FacebookProvider, Login } from 'react-facebook';
import { setAccessToken } from "../../../utils/axiosInstance";

function Signin() {

	const navigate = useNavigate();
	const location = useLocation();
	const { 
		user, 
		setUser,
		isLoading,
	} 
	= useProps();

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user]);

	useEffect(() => {
		if (location.state?.message) {
			Alert('success', location.state.message);
		}
	}, [location.state]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		event.target.lastChild.disabled = true;

		const email = event.target["email"].value.trim();
		const password = event.target["password"].value.trim();

		if (!email || !password) {
			Alert('warning', 'please enter all fields first');
			event.target.lastChild.disabled = false;
			event.target.reset();
			return false;
		}

		if (
			!/^[a-zA-Z0-9._]+@(gmail|outlook|hotmail|live|yahoo|icloud|me)\.com$/.test(
				email
			)
		) {
			Alert('warning', 'Please enter valid email');
			event.target.lastChild.disabled = false;
			event.target.reset();
			return false;
		}

		try {
			const user = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/users/signin`,
				{ 
					email, 
					password 
				},
				{
					withCredentials: true
				}
			).then(async (res) => {
				setAccessToken(res.data.accessToken);
				const { data: { user } } = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL}/api/users/current`, {
						headers: {
							Authorization: `Bearer ${res.data.accessToken}`
						}
					}
				);
				return user;
			});

			setUser(user);
			setTimeout(() => {
				navigate("/", { replace: true });
			}, 1500);
		} catch (err) {
			if (err.response) {
				Alert('error', err.response.data.message);
			} else {
				Alert("error", err.message);
			}
		}

		event.target.lastChild.disabled = false;
		event.target.reset();
	};

	const handleFacebookLogIn = async (response) => {
		if (!response.authResponse) return;
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/auth/facebook/callback`,
                {
                    facebookId: response.authResponse.userID,
                    accessToken: response.authResponse.accessToken,
                },
            );
        } catch (err) {
            console.log(err);
        } 
    };

	if (isLoading) return <Loader />

	return (
		<section className="w-full h-screen flex items-center justify-center lg:justify-between bg-(--bg-color)">
			<div className="w-full md:w-3/4 lg:w-1/2 h-full flex-col flex items-start justify-center px-5 md:px-10 lg:px-14 xl:px-20">
				<h1 className="text-5xl sm:text-6xl md:text-5xl font-Playfair text-(--primary-text) capitalize font-semibold mb-3 text-start">sign in</h1>
				<h3 className="w-full md:w-[90%] xl:w-[80%] font-Plus-Jakarta-Sans md:text-lg font-light text-(--secondary-text) mb-6 capitalize">
					Welcome back! Sign in to continue your journey
					toward finding the perfect home.
				</h3>
				<form
					onSubmit={handleSubmit}
					className="w-full flex flex-col items-start mb-4"
				>
					<label
						htmlFor="email"
						className="font-Plus-Jakarta-Sans text-xl font-normal text-(--primary-text) capitalize mb-2"
					>
						email:
					</label>
					<input
						type="email"
						name="email"
						id="email"
						placeholder="Enter Your Email"
						className="h-13 w-full rounded-[20px] px-4 sm:px-6 bg-[#676e80bd]/25 text-lg text-(--primary-text) placeholder:font-light placeholder:text-(--tertiary-color) mb-4 focus:outline-2 focus:outline-(--primary-color)"
						autoComplete="on"
					/>
					<label
						htmlFor="password"
						className="font-Plus-Jakarta-Sans text-xl font-normal text-(--primary-text) capitalize mb-2"
					>
						Password:
					</label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="Enter Your Password"
						className="h-13 w-full rounded-[20px] px-4 sm:px-6 bg-[#676e80bd]/25 text-lg text-(--primary-text) placeholder:font-light placeholder:text-(--tertiary-color)  mb-6 focus:outline-2 focus:outline-(--primary-color)"
						autoComplete="on"
					/>
					<button
						type="submit"
						className="w-full px-10 py-2.5 sm:py-3 rounded-[20px] bg-(--primary-color) text-lg sm:text-xl font-Playfair font-bold capitalize text-(--black-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95"
					>
						sign in
					</button>
				</form>
				<div className="w-full flex items-center justify-between">
					<h3 className="font-Plus-Jakarta-Sans text-sm sm:text-base font-light text-(--primary-text) capitalize">
						create an account?
						<Link to={"/role"}>
							<span className="text-(--primary-color) underline capitalize font-medium ms-1">
								sign up
							</span>
						</Link>
					</h3>
					<Link to={"/forgetpassword"}>
						<span className="font-Plus-Jakarta-Sans text-sm sm:text-base text-(--primary-color) underline capitalize font-medium ms-1">
							forget password
						</span>
					</Link>
				</div>
				<div className="w-full flex items-center justify-between my-2">
					<span className="h-[1px] w-[50%] rounded-full bg-(--primary-text)"></span>
					<h4 className="font-Plus-Jakarta-Sans text-lg text-(--primary-text) font-medium capitalize px-4">
						or
					</h4>
					<span className="h-[1px] w-[50%] rounded-full bg-(--primary-text)"></span>
				</div>
				<div className="w-full flex items-center justify-between gap-4 sm:gap-10">
					<Link to={`${import.meta.env.VITE_BACKEND_URL}/auth/google`} className="w-1/2">
						<button className="w-full h-13 bg-[#363C4D] flex items-center justify-center gap-2 rounded-[20px] cursor-pointer transition duration-300 ease-in-out hover:scale-95">
							<img src="/google.svg" alt="icon" />
							<h4 className="text-base font-Plus-Jakarta-Sans font-medium capitalize text-(--primary-text)">
								google
							</h4>
						</button>
					</Link>
					<FacebookProvider appId={import.meta.env.VITE_FACEBOOK_APP_ID} >
                        <Login
                            scope={['public_profile', 'email']}
                            onSuccess={handleFacebookLogIn}
                            onError={(err) => console.error(err)}
                            className="w-1/2 h-13 bg-[#363C4D] flex items-center justify-center gap-2 rounded-[20px] cursor-pointer transition duration-300 ease-in-out hover:scale-95"
                        >
                            <img src="/facebook.svg" alt="icon" />
                            <h4 className="text-base font-Plus-Jakarta-Sans font-medium capitalize text-(--primary-text)">facebook</h4>
                        </Login>
                    </FacebookProvider>
				</div>
			</div>
			<div className="hidden lg:block w-[50%] h-full bg-[url(/public1.png)] rounded-tl-4xl rounded-bl-4xl shadow-(--primary-text)"></div>
		</section>
	);
}

export default Signin;
