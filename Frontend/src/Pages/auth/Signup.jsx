import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { useProps } from "../../components/PropsProvider";
import Alert from "../../components/Alert";
import axios from "axios";
import { FacebookProvider, Login } from 'react-facebook';

function Signup() {
    
    const navigate = useNavigate();
    const { user, isLoading } = useProps();

    // role extracting
    const [ searchParams ] = useSearchParams();
    const role = searchParams.get("role");
    const hasRole = searchParams.has("role");

    useEffect(() => {
		if (user) {
			navigate("/");
		}

        if (!hasRole || !role) {
            navigate("/role");
        }
	}, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.target.lastChild.disabled = true;
        
        const name = event.target['name'].value.trim();
        const email = event.target['email'].value.trim();
        const password = event.target['password'].value.trim();

        if (!name || !email || !password) {
            Alert('warning', 'please enter all fields first');
            event.target.lastChild.disabled = false;
            event.target.reset();
            return false;
        }    
        
        if (!/^[a-zA-Z0-9._]+@(gmail|outlook|hotmail|live|yahoo|icloud|me)\.com$/.test(email)) {
            Alert('warning', 'please enter valid email');
            event.target.lastChild.disabled = false;
            event.target.reset();
            return false;
        }

        try {
            const { data: { message } } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/signup/?role=${searchParams.get("role")}`, { name, email, password });
            navigate("/signin", { state: { message } });
        } catch (err) {
            Alert('error', err.response?.data?.message);
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
        <section className="w-full min-h-screen lg:h-screen flex items-center justify-center lg:justify-between bg-(--bg-color)">
            <div className="w-ful md:w-3/4 lg:w-1/2 h-full flex-col flex items-start justify-center px-5 md:px-10 lg:px-14 xl:px-16 xxl:px-20 py-10 lg:py-0">
                <h1 className="text-5xl sm:text-6xl md:text-5xl font-Playfair text-(--primary-text) capitalize font-semibold mb-3 text-start">sign up</h1>
                <h3 className="w-full md:w-[90%] xl:w-[80%] font-Plus-Jakarta-Sans md:text-lg font-light text-(--secondary-text) mb-6 capitalize">Join us! sign up for exclusive real estate updates, listings, and expert insights</h3>
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-start mb-4">
                    <label htmlFor="name" className="font-Plus-Jakarta-Sans text-lg lg:text-xl font-normal text-(--primary-text) capitalize mb-2">name:</label>
                    <input type="text" name="name" id="name" placeholder="Enter Your Name" className="h-13 w-full rounded-[20px] px-4 sm:px-6 bg-[#676e80bd]/25 text-lg text-(--primary-text) placeholder:font-light placeholder:text-(--tertiary-color) mb-4 focus:outline-2 focus:outline-(--primary-color)" autoComplete="false"/>
                    <label htmlFor="email" className="font-Plus-Jakarta-Sans text-lg lg:text-xl font-normal text-(--primary-text) capitalize mb-2">email:</label>
                    <input type="email" name="email" id="email" placeholder="Enter Your Email" className="h-13 w-full rounded-[20px] px-4 sm:px-6 bg-[#676e80bd]/25 text-lg text-(--primary-text) placeholder:font-light placeholder:text-(--tertiary-color) mb-4 focus:outline-2 focus:outline-(--primary-color)" autoComplete="false"/>
                    <label htmlFor="password" className="font-Plus-Jakarta-Sans text-lg lg:text-xl font-normal text-(--primary-text) capitalize mb-2">Password:</label>
                    <input type="password" name="password" id="password" placeholder="Enter Your Password" className="h-13 w-full rounded-[20px] px-4 sm:px-6 bg-[#676e80bd]/25 text-lg text-(--primary-text) placeholder:font-light placeholder:text-(--tertiary-color) mb-6 focus:outline-2 focus:outline-(--primary-color)" autoComplete="false"/>
                    <button type="submit" className="w-full px-10 py-2.5 sm:py-3 rounded-[20px] bg-(--primary-color) text-lg sm:text-xl font-Playfair font-bold capitalize text-(--black-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95">sign up</button>
                </form>
                <div className="w-full flex items-center justify-center">
                    <h3 className="font-Plus-Jakarta-Sans text-sm sm:text-base font-light text-(--primary-text) capitalize">
                        Already have an account?
                        <Link to={'/signin'}>
                            <span className="text-(--primary-color) underline capitalize font-medium ms-1">sign in</span>
                        </Link>
                    </h3>
                </div>
                <div className="w-full flex items-center justify-between my-2">
                    <span className="h-[1px] w-[50%] rounded-full bg-(--primary-text)"></span>
                    <h4 className="font-Plus-Jakarta-Sans text-lg text-(--primary-text) font-medium capitalize px-4">or</h4>
                    <span className="h-[1px] w-[50%] rounded-full bg-(--primary-text)"></span>
                </div>
                <div className="w-full flex items-center justify-between gap-4 sm:gap-10">
                    <Link to={`${import.meta.env.VITE_BACKEND_URL}/auth/google/?role=${searchParams.get('role')}`} className="w-1/2">
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
            <div className="hidden lg:block lg:w-[50%] h-full bg-[url(/public2.png)] rounded-tl-4xl rounded-bl-4xl shadow-(--primary-text)"></div>
        </section>
    )
}

export default Signup;
