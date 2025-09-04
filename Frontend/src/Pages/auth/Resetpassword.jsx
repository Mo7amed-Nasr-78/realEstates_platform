import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProps } from "../../components/PropsContext";
import Alert from "../../components/Alert";
import axios from "axios";
import Loader from "../../components/Loader";


function Resetpassword() {

    const location = useLocation();
    const navigate = useNavigate();
    const { user, url } = useProps();
    const [ isLoading, setIsLoading ] = useState(false);

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
    
        const newPass = event.target['newPass'].value;
        const confirmPass = event.target['confirmPass'].value;

        const params = new URLSearchParams(window.location.search);
        const token = params.get('e');
    
        if (!newPass || !confirmPass) {
            Alert('warning', 'please enter all fields first');
            event.target.lastChild.disabled = false; 
            event.target.reset();
            return;
        }

        if (newPass !== confirmPass) {
            Alert('warning', 'password is\'t identical');
            event.target.lastChild.disabled = false; 
            event.target.reset();
            return;
        }

        setIsLoading(true);
        try {
            const res = (await axios.post(`${url}/api/users/resetpassword`, { newPass, confirmPass, token })).data;
            navigate(res.redirectUrl, { state: { message: res.message } });
        } catch (err) {
            Alert('error', err.response?.data?.message);
        } finally {
            setIsLoading(false);
        }

        event.target.reset();
        event.target.lastChild.disabled = false;
    }

    if (isLoading) return <Loader />

    return (
        <section className="w-full h-screen flex items-center justify-between bg-(--bg-color)">
            <div className="w-full lg:w-[50%] h-full flex flex-col items-center justify-center md:px-10 lg:px-14 xl:px-20">
                <h1 className="text-4xl sm:text-6xl md:text-5xl font-Playfair text-(--primary-text) capitalize font-semibold mb-3 text-center">reset password</h1>
                <h3 className="w-full md:w-[90%] xl:w-[80%] font-Plus-Jakarta-Sans text-base md:text-lg font-light text-(--secondary-text) text-center mb-6 capitalize">secure your account and get back to exploring your dream home.</h3>
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-start mb-4">
                    <label htmlFor="newPass" className="font-Plus-Jakarta-Sans text-lg sm:text-xl font-normal text-(--primary-text) capitalize mb-2">new password:</label>
                    <input type="password" name="newPass" id="newPass" placeholder="Enter Your New Password" className="h-14 w-full rounded-[20px] px-6 bg-[#676e80bd]/25 text-lg text-(--primary-text) placeholder:font-light placeholder:text-(--tertiary-color) mb-4 focus:outline-2 focus:outline-(--primary-color)" autoComplete="false"/>
                    <label htmlFor="confirmPass" className="font-Plus-Jakarta-Sans text-lg sm:text-xl font-normal text-(--primary-text) capitalize mb-2">confirm password:</label>
                    <input type="password" name="confirmPass" id="confirmPass" placeholder="Enter Your Confirm Password" className="h-14 w-full rounded-[20px] px-6 bg-[#676e80bd]/25 text-lg text-(--primary-text) placeholder:font-light placeholder:text-(--tertiary-color)  mb-6 focus:outline-2 focus:outline-(--primary-color)" autoComplete="false"/>
                    <button type="submit" className="w-full px-10 py-3 rounded-[20px] bg-(--primary-color) text-xl font-Playfair font-bold capitalize text-(--black-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95">continue</button>
                </form>
                <div className="w-full flex items-center justify-center">
                    <h3 className="font-Plus-Jakarta-Sans text-base font-light text-(--primary-text) capitalize">
                        for any question?
                        <Link to={'/helpcenter'}>
                            <span className="text-(--primary-color) underline capitalize font-medium ms-1">help center</span>
                        </Link>
                    </h3>
                </div>
            </div>
            <div className="hidden lg:block lg:w-[50%] h-full bg-[url(/public3.png)] rounded-tl-4xl rounded-bl-4xl shadow-(--primary-text)"></div>
        </section>
    )
}

export default Resetpassword;