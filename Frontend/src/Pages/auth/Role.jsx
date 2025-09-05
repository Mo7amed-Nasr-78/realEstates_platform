import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiUserLight } from 'react-icons/pi';
import { useProps } from "../../components/PropsContext";

function Role() {

    const { user } = useProps();
    const navigate = useNavigate();
    const [ active, setActive ] = useState('');

    useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user]);

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate(`/signup/?role=${event.target.role.value}`);
    }

    const handleChange = (event) => {
        setActive(event.target.value);
    }

    return (
        <section className="w-full h-screen flex items-center justify-center lg:justify-between bg-(--bg-color)">
            <div className="md:w-[65%] lg:w-[50%] h-full flex-col flex items-center justify-center px-5 md:px-10 lg:px-14 xl:px-20">
                <h1 className="text-4xl sm:text-6xl md:text-5xl font-Playfair text-(--primary-text) capitalize font-semibold mb-3 text-center">what's your role</h1>
                <h3 className="w-full md:w-[90%] xl:w-[80%] font-Plus-Jakarta-Sans text-base md:text-lg font-light text-(--secondary-text) text-center mb-6 capitalize">choose your account as properties agent or properties finder</h3>
                <form onSubmit={handleSubmit} className="w-full mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8">
                        <label htmlFor="finder" className={`${active.includes('finder')? 'bg-(--secondary-color)/25 border-(--primary-color)': 'bg-(--secondary-color)' } sm:w-[50%] flex sm:flex-col items-center gap-3 px-3 sm:px-8 py-3 sm:py-14 bg-(--secondary-color) hover:bg-[#38405480] rounded-4xl transition duration-300 ease-in-out border-2 border-(--secondary-color) hover:border-(--primary-color) cursor-pointer`}>
                            <div className="min-w-12 min-h-12 sm:min-w-18 sm:min-h-18 flex items-center justify-center rounded-full bg-[#51c20640]">
                                <PiUserLight className="text-2xl sm:text-4xl text-(--primary-text)"/>
                            </div>
                            <h3 className="font-Plus-Jakarta-Sans text-lg capitalize text-center text-(--primary-text)">properties <br className="hidden sm:block"/> finder</h3>
                        </label>
                        <input onChange={handleChange} type="radio" name="role" id="finder" value="finder" className="hidden h-12 w-full rounded-[20px] px-6 bg-[#676e80bd] text-lg text-(--primary-text) placeholder:text-(--tertiary-color) mb-4" autoComplete="false"/>
                        <label htmlFor="agent" className={`${active.includes('agent')? 'bg-(--secondary-color)/25 border-(--primary-color)': 'bg-(--secondary-color)' } sm:w-[50%] flex sm:flex-col items-center gap-3 px-3 sm:px-8 py-3 sm:py-14 bg-(--secondary-color) hover:bg-[#38405480] rounded-4xl transition duration-300 ease-in-out border-2 border-(--secondary-color) hover:border-(--primary-color) cursor-pointer`}>
                            <div className="min-w-12 min-h-12 sm:min-w-18 sm:min-h-18 flex items-center justify-center rounded-full bg-[#51c20640]">
                                <PiUserLight className="text-2xl sm:text-4xl text-(--primary-text)"/>
                            </div>
                            <h3 className="font-Plus-Jakarta-Sans text-lg capitalize text-center text-(--primary-text)">properties <br className="hidden sm:block"/> agent</h3>
                        </label>
                        <input onChange={handleChange} type="radio" name="role" id="agent" value="agent" className="hidden h-12 w-full rounded-[20px] px-6 bg-[#676e80bd] text-lg text-(--primary-text) placeholder:text-(--tertiary-color)  mb-6" autoComplete="false"/>
                    </div>
                    <button type="submit" className="w-full px-10 py-2.5 sm:py-3 rounded-[20px] bg-(--primary-color) text-lg sm:text-xl font-Playfair font-bold capitalize text-(--black-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95">continue</button>
                </form>
                <div className="w-full flex items-center justify-center">
                    <h3 className="font-Plus-Jakarta-Sans text-sm sm:text-base font-light text-(--primary-text) capitalize">
                        Already have an account?
                        <Link to={'/signin'}>
                            <span className="text-(--primary-color) underline capitalize font-medium ms-1">sign in</span>
                        </Link>
                    </h3>
                </div>
            </div>
            <div className="w-[50%] h-full hidden lg:block bg-[url(/public4.png)] rounded-tl-4xl rounded-bl-4xl shadow-(--primary-text)"></div>
        </section>
    )
}

export default Role;