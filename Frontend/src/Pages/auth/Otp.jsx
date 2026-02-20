import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useProps } from "../../components/PropsProvider";
import Alert from "../../components/Alert";
import axios from "axios";


function Otp() {

    const location = useLocation();
    const inputsRef = useRef([]);
    const navigate = useNavigate();
    const { user, isLoading } = useProps();
    const [ otp, setOtp ] = useState(["","","","","",""]);
    
    // token extracting
    const [ searchParams ] = useSearchParams();
    const hasToken = searchParams.has('e');
    const token = searchParams.get('e');

    useEffect(() => {
		if (user) {
			navigate('/');
		}

        if (!hasToken || !token) {
            navigate('/');
        }
	}, [user]);

    useEffect(() => {
        if (location.state?.message) {
            Alert('success', location.state.message);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const enteredOtp = [...otp].join('');
        
        if (!enteredOtp) {
            Alert('warning', 'please enter OTP first');
            return;
        }

        try {
            const res = (await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/otp/verify`, { otp: enteredOtp, token })).data;
            navigate(res.redirectUrl, { state: { message: res.message } })
        } catch (err) {
            if (err.response) {
                Alert("error", err.response.data.message);
            } else {
                Alert("error", err.message);
            }
        } 
    }

    const handleChange = (e, index) => {
        const value = e.target.value;

        if (!/^\d?$/.test(value)) {
            Alert('warning', 'invalid OTP number');
            return;
        };

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);


        if (value && index < otp.length - 1) {
            inputsRef.current[index + 1].focus();
        }
    }
    
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    }

    if (isLoading) return <Loader />

    return (
        <section className="relative w-full min-h-screen lg:h-screen flex items-center justify-center lg:justify-between bg-(--bg-color)">
            <div className="w-full md:w-3/4 lg:w-1/2 h-full flex-col flex items-center justify-center px-5 md:px-10 lg:px-14 xl:px-20">
                <h1 className="text-4xl sm:text-6xl md:text-5xl font-Playfair text-(--primary-text) capitalize font-semibold mb-3 text-center">OTP</h1>
                <h3 className="w-full md:w-[90%] xl:w-[80%] font-Plus-Jakarta-Sans text-base md:text-lg font-light text-(--secondary-text) text-center mb-6 capitalize">Enter the OTP sent to your email/phone to verify and secure your account.</h3>
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-start mb-4">
                    <label htmlFor="newPass" className="font-Plus-Jakarta-Sans text-xl font-normal text-(--primary-text) capitalize mb-3">otp:</label>
                    <div className="flex items-center gap-2 lg:gap-3 mb-6">
                        {
                            otp.map((digit, index) => (
                                <input 
                                    key={index}
                                    type="text"
                                    value={digit}
                                    maxLength={1}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    ref={(el) => (inputsRef.current[index] = el)}
                                    autoComplete="false"
                                    className="h-16 sm:h-18 xl:h-22 w-[20%] rounded-2xl sm:rounded-3xl p-0 bg-[#676e80bd]/25 text-3xl text-center text-(--primary-text) placeholder:text-(--tertiary-color) focus:outline-2 focus:outline-(--primary-color) font-normal"
                                />
                            ))
                        }
                    </div>
                    <button type="submit" className="w-full py-2.5 sm:py-3 rounded-[20px] bg-(--primary-color) text-lg sm:text-xl font-Playfair font-bold capitalize text-(--black-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95">verify</button>
                </form>
                <div className="w-full flex items-center justify-center">
                    <h3 className="font-Plus-Jakarta-Sans text-base font-light text-(--primary-text) capitalize">
                        resend after?
                        <Link to={'/helpcenter'}>
                            <span className="text-(--primary-color) underline capitalize font-medium ms-1">4:52</span>
                        </Link>
                    </h3>
                </div>
            </div>
            <div className="hidden lg:block lg:w-[50%] h-full bg-[url(/public4.png)] rounded-tl-4xl rounded-bl-4xl shadow-(--primary-text)"></div>
        </section>
    )
}

export default Otp;