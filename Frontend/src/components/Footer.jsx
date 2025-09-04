import 
{ 
    PiFacebookLogoLight, 
    PiInstagramLogoLight,
    PiXLogoLight,
    PiYoutubeLogoLight,
    PiThreadsLogoLight
} 
from 'react-icons/pi';

function Footer() {
    return (
        <footer className="p-4 sm:p-6">
            <div className="w-full bg-(--black-color) rounded-3xl">
                <div className="container mx-auto py-8 px-5 lg:px-0">
                    <img src="/logo.svg" alt="logo" className="h-13 lg:h-15 mb-3 sm:mb-5"/>
                    <div className="flex flex-col lg:flex-row items-start lg:justify-between gap-8 lg:gap-0">
                        <div className="w-full lg:w-1/2 flex flex-col">
                            <h3 className="xl:w-3/4 font-Plus-Jakarta-Sans font-light text-lg sm:text-xl text-(--secondary-text) leading-8 mb-8">Your trusted partner in finding the perfect home. Explore listings, expert advice, and seamless real estate solutions.</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <h4 className="font-Plus-Jakarta-Sans text-xl font-light text-(--secondary-text) capitalize">follow us:</h4>
                                <div className="flex items-center gap-4">
                                    <PiFacebookLogoLight className='text-3xl text-(--primary-color) cursor-pointer duration-300 ease-in-out hover:scale-120'/>
                                    <PiInstagramLogoLight className='text-3xl text-(--primary-color) cursor-pointer duration-300 ease-in-out hover:scale-120'/>
                                    <PiThreadsLogoLight className='text-3xl text-(--primary-color) cursor-pointer duration-300 ease-in-out hover:scale-120'/>
                                    <PiXLogoLight className='text-3xl text-(--primary-color) cursor-pointer duration-300 ease-in-out hover:scale-120'/>
                                    <PiYoutubeLogoLight className='text-3xl text-(--primary-color) cursor-pointer duration-300 ease-in-out hover:scale-120'/>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-10">
                            <div className="flex flex-col">
                                <h3 className='font-Plus-Jakarta-Sans font-medium capitalize text-xl sm:text-2xl text-(--primary-text) mb-3'>platform</h3>
                                <ul className='flex flex-col gap-1 sm:gap-2'>
                                    <li>
                                        <a href="#" className='font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) capitalize hover:underline'>How It Works</a>
                                    </li>
                                    <li>
                                        <a href="#" className='font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) capitalize hover:underline'>fraud</a>
                                    </li>
                                    <li>
                                        <a href="#" className='font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) capitalize hover:underline'>payments</a>
                                    </li>
                                    <li>
                                        <a href="#" className='font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) capitalize hover:underline'>accounts</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex flex-col">
                                <h3 className='font-Plus-Jakarta-Sans font-medium capitalize text-xl sm:text-2xl text-(--primary-text) mb-3'>support</h3>
                                <ul className='flex flex-col gap-1 sm:gap-2'>
                                    <li>
                                        <a href="#" className='font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) capitalize hover:underline'>about us</a>
                                    </li>
                                    <li>
                                        <a href="#" className='font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) capitalize hover:underline'>help center</a>
                                    </li>
                                    <li>
                                        <a href="#" className='font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) capitalize hover:underline'>contact</a>
                                    </li>
                                    <li>
                                        <a href="#" className='font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) capitalize hover:underline'>FAQ</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex flex-col">
                                <h3 className='font-Plus-Jakarta-Sans font-medium capitalize text-xl sm:text-2xl text-(--primary-text) mb-3'>legal</h3>
                                <ul className='flex flex-col gap-1 sm:gap-2'>
                                    <li>
                                        <a href="#" className='font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) capitalize hover:underline'>privacy policy</a>
                                    </li>
                                    <li>
                                        <a href="#" className='font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) capitalize hover:underline'>terms of services</a>
                                    </li>
                                    <li>
                                        <a href="#" className='font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) capitalize hover:underline'>security</a>
                                    </li>
                                    <li>
                                        <a href="#" className='font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) capitalize hover:underline'>cookies</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <hr className='text-(--secondary-text) my-5 sm:my-10'/>
                    <h4 className='font-Plus-Jakarta-Sans font-light text-center text-sm sm:text-xl text-(--primary-text)'>2024 Glossy, All rights reserved.</h4>
                </div>
            </div>
        </footer>
    );
}

export default Footer;