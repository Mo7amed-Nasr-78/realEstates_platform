import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProps } from "../../components/PropsProvider";
import Alert from "../../components/Alert";
import axios from 'axios';
import Loader from "../../components/Loader";

function Forgetpassword() {

    const navigate = useNavigate();
    const { user, isLoading } = useProps();

    useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.target.lastChild.disabled = true;
        
        const email = event.target['email'].value;

        if (!email) {
            Alert('warning', 'please enter your email');
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
            const { data: { redirectUrl, message } } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/forgetpassword`, { email });
            navigate(redirectUrl, { state: { message: message } });
        } catch (err) {
            Alert('error', err.response?.data?.message);
        } 

        event.target.lastChild.disabled = false;
        event.target.reset();
    }
    
    if (isLoading) return <Loader />

    return (
        <section className="w-full h-screen flex items-center justify-center lg:justify-between bg-(--bg-color)">
            <div className="w-full md:w-3/4 lg:w-[50%] h-full flex-col flex items-center justify-center px-5 md:px-10 lg:px-14 xl:px-20">
                <h1 className="text-4xl sm:text-6xl md:text-5xl font-Playfair text-(--primary-text) capitalize font-semibold mb-3 text-center">forget password</h1>
                <h3 className="w-full md:w-[90%] xl:w-[80%] font-Plus-Jakarta-Sans text-base md:text-lg font-light text-(--secondary-text) text-center mb-6 capitalize">No worries! Reset it quickly and securely to regain access to your account.</h3>
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-start mb-4">
                    <label htmlFor="email" className="font-Plus-Jakarta-Sans text-lg sm:text-xl font-normal text-(--primary-text) capitalize mb-2">email:</label>
                    <input type="email" name="email" id="email" placeholder="Enter Your Email" className="h-13 w-full rounded-[20px] px-4 sm:px-6 bg-[#676e80bd]/25 text-lg text-(--primary-text) placeholder:text-(--tertiary-color) placeholder:font-light mb-4 focus:outline-2 focus:outline-(--primary-color)" autoComplete="false"/>
                    <button type="submit" className="w-full py-2.5 sm:py-3 rounded-[20px] bg-(--primary-color) text-lg sm:text-xl font-Playfair font-bold capitalize text-(--black-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95">continue</button>
                </form>
                <div className="w-full flex items-center justify-center">
                    <h3 className="font-Plus-Jakarta-Sans text-base font-light text-(--primary-text) capitalize">
                        for any question?
                        <Link to={'/'}>
                            <span className="text-(--primary-color) underline capitalize font-medium ms-1">help center</span>
                        </Link>
                    </h3>
                </div>
            </div>
            <div className="hidden lg:block w-[50%] h-full bg-[url(/public4.png)] rounded-tl-4xl rounded-bl-4xl shadow-2xs"></div>
        </section>
    )
}

export default Forgetpassword;