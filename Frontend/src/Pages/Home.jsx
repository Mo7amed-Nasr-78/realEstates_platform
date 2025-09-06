import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import 
{ 
    PiFacebookLogoLight, 
    PiInstagramLogoLight,
    PiXLogoLight,
    PiYoutubeLogoLight,
    PiStarFill,
    PiStarLight,
    PiBuildings,
    PiUsers,
    PiStar,
    PiShieldCheck,
    PiSpinnerGap,
    PiArrowUpRight,
    PiBed,
    PiBathtub,
    PiGarage,
    PiRulerDuotone,
    PiArrowRight,
    PiArrowLeft,
} 
from 'react-icons/pi';
import { useProps } from "../components/PropsContext";
import { Link } from "react-router-dom";
import axios from "axios";
import Carousel from "../components/Carousel";

function Home() {

    const { url, isLoading } = useProps();
    const [ properties, setProperties ] = useState([]);

    useEffect(() => {
        
        const getProperties = async () => {
            try {
                const res = (await axios.get(
                    `${url}/api/property/getAll`, 
                    { 
                        withCredentials: true,
                        params: {
                            page: 1
                        },
                    })
                ).data
                setProperties(res.properties);
            } catch (err) {
                console.log(err);
            }
        }
        getProperties();

    }, []);


    if (isLoading) return <Loader />

    return (
        <main>
            <Header />
            <section className="w-full sm:min-h-screen lg:h-screen mt-26 md:mt-32 lg:mt-0 mb-18 xs:mb-25">
                <div className="container mx-auto h-full flex flex-col-reverse lg:flex-row items-center justify-between gap-32 xs:gap-36 lg:gap-10 relative">
                    <div className="w-full lg:w-1/2 h-full flex flex-col justify-center mb-24 xs:mb-30 lg:mb-0">
                        <h1 className="md:w-[80%] xl:w-[70%] font-Playfair text-4xl xs:text-5xl sm:text-6xl xxl:text-7xl capitalize text-(--primary-text) font-extrabold leading-12 xs:leading-14 sm:leading-19 xxl:leading-22 mb-4 lg:mt-12 xl:mt-4">the <span className="font-Delicious-Handrawn font-medium text-(--primary-color)">simplest</span> way to find your <span className="font-Delicious-Handrawn font-medium text-(--primary-color)">property</span></h1>
                        <h3 className="font-Plus-Jakarta-Sans sm:w-10/12 text-base xs:text-lg sm:text-xl lg:text-lg xl:text-xl font-light text-(--secondary-text) mb-10 xs:mb-12">Browse exclusive listings from trusted local agents. From luxury condos to family homes.</h3>
                        <div className="flex items-center gap-4 xs:gap-6">
                            <Link to="/listings">
                                <button className="mainBtn">listigns</button>
                            </Link>
                            <button className="secondBtn">more</button>
                        </div>
                        <div className="flex items-center gap-3 absolute left-4 sm:left-0 bottom-4">
                            <div className="w-10 h-10 xs:w-12  xs:h-12 flex items-center justify-center rounded-full border-1 border-(--primary-text) cursor-pointer transition duration-300 ease-in-out hover:bg-(--primary-color) hover:border-(--primary-color) hover:scale-95">
                                <PiFacebookLogoLight  className="text-2xl xs:text-3xl text-(--primary-text)"/>
                            </div>
                            <div className="w-10 h-10 xs:w-12  xs:h-12 flex items-center justify-center rounded-full border-1 border-(--primary-text) cursor-pointer transition duration-300 ease-in-out hover:bg-(--primary-color) hover:border-(--primary-color) hover:scale-95">
                                <PiInstagramLogoLight  className="text-2xl xs:text-3xl text-(--primary-text)"/>
                            </div>
                            <div className="w-10 h-10 xs:w-12  xs:h-12 flex items-center justify-center rounded-full border-1 border-(--primary-text) cursor-pointer transition duration-300 ease-in-out hover:bg-(--primary-color) hover:border-(--primary-color) hover:scale-95">
                                <PiXLogoLight  className="text-2xl xs:text-3xl text-(--primary-text)"/>
                            </div>
                            <div className="w-10 h-10 xs:w-12  xs:h-12 flex items-center justify-center rounded-full border-1 border-(--primary-text) cursor-pointer transition duration-300 ease-in-out hover:bg-(--primary-color) hover:border-(--primary-color) hover:scale-95">
                                <PiYoutubeLogoLight  className="text-2xl xs:text-3xl text-(--primary-text)"/>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 h-full flex items-center my-auto relative">
                        <div className="w-full lg:w-11/12 ms-auto relative">
                            <img src="/focalPoint.webp" alt="image" loading="lazy" className="w-full"/>
                            <img src="/asterisk_1.svg" alt="icon" loading="lazy" className="absolute -top-2 -left-2 xs:top-0 xs:left-0 scale-65 xs:scale-100"/>
                            <img src="/asterisk_2.svg" alt="icon" loading="lazy" className="absolute -bottom-18 right-2 xs:-bottom-24 xs:right-10 scale-75 xs:scale-100"/>

                            <div className="absolute top-0 -right-4 xs:top-3 sm:top-8 xs:right-4 sm:right-16 md:right-24 lg:top-4 xl:top-5 lg:right-3 xl:right-7 xxl:right-10 flex items-center gap-2 py-2 px-3 bg-(--primary-text) rounded-2xl scale-60 xs:scale-80 sm:scale-120 lg:scale-90 xl:scale-100">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[rgba(81,194,6,0.1)]">
                                    <PiBuildings  className="text-3xl text-(--primary-color)"/>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-lg text-(--black-color) font-Plus-Jakarta-Sans font-bold leading-6">+1k</h3>
                                    <h4 className="text-sm text-(--blaack-color) font-Plus-Jakarta-Sans font-normal capitalize">available properties</h4>
                                </div>
                            </div>

                            <div className="absolute bottom-0 -left-2 xs:bottom-3 sm:bottom-8 xs:left-6 sm:left-18 md:left-26 lg:bottom-3 xl:bottom-4 lg:left-7 xl:left-10 xxl:left-14 flex items-center gap-2 py-2 px-3 bg-(--primary-text) rounded-2xl scale-60 xs:scale-80 sm:scale-120 lg:scale-90 xl:scale-100">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[rgba(81,194,6,0.1)]">
                                    <PiUsers  className="text-3xl text-(--primary-color)"/>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-lg text-(--black-color) font-Plus-Jakarta-Sans font-bold leading-6">+13k</h3>
                                    <h4 className="text-sm text-(--blaack-color) font-Plus-Jakarta-Sans font-normal capitalize">active members</h4>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 absolute -bottom-22 left-0">
                                <div className="flex items-center">
                                    <img src="/Ellipse34.png" alt="image" loading="lazy" className="h-12 xs:h-15 duration-300 ease-in-out hover:scale-95 hover:-translate-y-1 z-0 cursor-pointer"/>
                                    <img src="/Ellipse35.png" alt="image" loading="lazy" className="h-12 xs:h-15 -ms-8 duration-300 ease-in-out hover:scale-95 hover:-translate-y-1 z-[2] cursor-pointer"/>
                                    <img src="/Ellipse36.png" alt="image" loading="lazy" className="h-12 xs:h-15 -ms-8 duration-300 ease-in-out hover:scale-95 hover:-translate-y-1 z-[3] cursor-pointer"/>
                                </div>
                                <div className="flex flex-col justify-center gap-1">
                                    <div className="flex items-center gap-1">
                                        <div className="flex items-center gap-[2px]">
                                            <PiStarFill className="text-xs xs:text-sm text-[#FEC305]"/>
                                            <PiStarFill className="text-xs xs:text-sm text-[#FEC305]"/>
                                            <PiStarFill className="text-xs xs:text-sm text-[#FEC305]"/>
                                            <PiStarFill className="text-xs xs:text-sm text-[#FEC305]"/>
                                            <PiStarLight className="text-xs xs:text-sm text-[#FEC305]"/>
                                        </div>
                                        <span className="font-Plus-Jakarta-Sans text-xs xs:text-sm font-medium text-(--primary-text)">2.5</span>
                                    </div>
                                    <h6 className="font-Plus-Jakarta-Sans text-sm font-medium text-(--grey-color) capitalize">from +500 <a href="#" className="text-(--primary-text) underline ms-1">reviews</a></h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full my-20 sm:my-30">
                <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-18 xs:gap-16 sm:gap-18 lg:gap-6 xl:gap-12">
                    <div className="w-full xl:w-[45%] flex flex-col gap-6">
                        <div className="w-full flex items-center gap-3 md:gap-8 lg:gap-6 xl:gap-8">
                            <div className="w-1/2">
                                <img src="/about1.png" alt="image" className="w-full xl:ms-auto object-cover"/>
                            </div>
                            <div className="w-1/2 flex flex-col">
                                <h3 className="font-Plus-Jakarta-Sans font-medium text-base xs:text-2xl sm:text-4xl md:text-4xl lg:text-2xl xl:text-2xl xxl:text-3xl text-(--primary-text) capitalize pe-4 sm:leading-12 md:leading-12 lg:leading-10 mb-6 sm:mb-10">every <span className="font-Delicious-Handrawn font-normal text-(--primary-color)">week</span> there is <span className="font-Delicious-Handrawn font-normal text-(--primary-color)">set</span> of two <span className="font-Delicious-Handrawn font-normal text-(--primary-color)">tours</span></h3>
                                <div className="flex items-center mb-6">
                                    <img src="/home1.png" alt="image" className="h-10 xs:h-12 sm:h-14 md:h-16 lg:h-14 z-[1] duration-300 ease-in-out hover:-translate-y-2 cursor-pointer"/>
                                    <img src="/home2.png" alt="image" className="h-10 xs:h-12 sm:h-14 md:h-16 lg:h-14 -ms-4 xs:-ms-8 z-[2] duration-300 ease-in-out hover:-translate-y-2 cursor-pointer"/>
                                    <img src="/home3.png" alt="image" className="h-10 xs:h-12 sm:h-14 md:h-16 lg:h-14 -ms-4 xs:-ms-8 z-[3] duration-300 ease-in-out hover:-translate-y-2 cursor-pointer"/>
                                </div>
                                <p className="xl:w-full xxl:w-10/12 font-Plus-Jakarta-Sans font-light text-xs xs:text-base sm:text-xl md:text-2xl lg:text-sm xl:text-base xxltext-lg text-(--secondary-text) line-clamp-2 xs:line-clamp-none">High quality photos, verified floor plans and virtual tours for all properties</p>
                            </div>
                        </div>
                        <div className="w-full flex items-center gap-3 md:gap-8 lg:gap-6 xl:gap-8">
                            <div className="w-1/2 flex flex-col gap-5 lg:gap-0">
                                <h3 className="font-Plus-Jakarta-Sans font-semibold text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-6xl xxl:text-7xl text-(--primary-text) capitalize pe-4 sm:mb-2 md:mb-3 xl:mb-4 xxl:mb-8">+12.8k</h3>
                                <h4 className="font-Plus-Jakarta-Sans font-light text-sm xs:text-xl sm:text-2xl md:text-3xl lg:text-xl xl:text-2xl text-(--primary-text) capitalize sm:mb-8 lg:mb-4 xl:mb-8">world wide satisfied customer</h4>
                                <div className="flex items-end xxl:gap-2">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-Plus-Jakarta-Sans font-medium text-sm xs:*:text-lg md:text-2xl lg:text-lg text-(--primary-text) capitalize">pricing index</h4>
                                        <h5 className="font-Plus-Jakarta-Sans font-light text-sm md:text-xl lg:text-base text-(--secondary-text) capitalize line-clamp-1 xs:line-clamp-none">Explore our listings to know what's fits your needs</h5>
                                    </div>
                                    <div className="hidden sm:flex lg:hidden xxl:flex min-w-12 min-h-12 items-center justify-center rounded-full border-2 border-(--primary-color) duration-300 ease-in-out hover:scale-95 cursor-pointer">
                                        <PiArrowUpRight className="text-2xl text-(--primary-color)"/>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2">
                                <img src="/about2.png" alt="image" className="w-full xl:me-auto object-cover"/>
                            </div>
                        </div>
                    </div>
                    <div className="w-full xl:w-1/2 h-full flex flex-col items-start justify-center">
                        <h2 className="font-Playfair font-semibold text-4xl xs:text-5xl sm:text-6xl lg:text-5xl xl:text-6xl text-(--primary-text) capitalize mb-3 xs:mb-5 sm:mb-6">why choose us?</h2>
                        <h4 className="xl:w-10/12  font-Plus-Jakarta-Sans font-light text-base xs:text-lg sm:text-xl lg:text-lg xl:text-xl text-(--secondary-text) xs:leading-7 sm:leading-8 lg:leading-7 xl:leading-7 mb-12">We are providing the best properties for you because we believe that having a good home can greatly improve the quality of your life.</h4>
                        <div className="flex flex-col gap-10">
                            <div className="flex flex-col xs:flex-row items-start gap-4 xs:gap-3">
                                <div className="min-w-12 min-h-12 flex items-center justify-center bg-[rgb(81,194,6,0.1)] rounded-full">
                                    <PiStar className="text-2xl text-(--primary-text)"/>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-Playfair font-normal text-2xl sm:text-3xl text-(--primary-text)">Cost Benefit</h3>
                                    <h4 className="font-Plus-Jakarta-Sans font-extralight text-base sm:text-xl lg:text-base xl:text-xl text-(--secondary-text)">We offer you the best property at the lowest price with various types of discounts for further savings</h4>
                                </div>
                            </div>
                            <div className="flex flex-col xs:flex-row items-start gap-4 xs:gap-3">
                                <div className="min-w-12 min-h-12 flex items-center justify-center bg-[rgb(81,194,6,0.1)] rounded-full">
                                    <PiShieldCheck className="text-2xl text-(--primary-text)"/>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-Playfair font-normal text-2xl sm:text-3xl text-(--primary-text)">Property Insurance</h3>
                                    <h4 className="font-Plus-Jakarta-Sans font-extralight text-base sm:text-xl lg:text-base xl:text-xl text-(--secondary-text)">We provide comprehensive property insurance for all of our customers to protect their investment.</h4>
                                </div>
                            </div>
                            <div className="flex flex-col xs:flex-row items-start gap-4 xs:gap-3">
                                <div className="min-w-12 min-h-12 flex items-center justify-center bg-[rgb(81,194,6,0.1)] rounded-full">
                                    <PiSpinnerGap className="text-2xl text-(--primary-text)"/>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-Playfair font-normal text-2xl sm:text-3xl text-(--primary-text)">Quick Process</h3>
                                    <h4 className="font-Plus-Jakarta-Sans font-extralight text-base sm:text-xl lg:text-base xl:text-xl text-(--secondary-text)">We strive to make the process of finding a property as streamlined and efficient as possible. </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full px-4 xs:px-0"> 
                <div className="container mx-auto h-[540px] xs:h-[560px] sm:h-[620px] flex flex-col justify-between bg-[url(/banner.png)] bg-no-repeat object-cover object-center rounded-4xl my-20 xs:my-18 sm:my-22 p-12">
                    <div className="flex flex-col gap-2">
                        <h2 className="xl:w-2/3 font-Playfair font-semibold text-3xl xs:text-4xl sm:text-5xl lg:text-6xl text-(--primary-text) capitalize leading-10 xs:leading-12 sm:leading-15 md:leading-17">Find What You Need Buy, Rent, or <span className="font-Delicious-Handrawn font-normal text-(--primary-color)">build</span> with Confidence</h2>
                        <h3 className="w-full sm:w-3/5 md:w-11/12 xl:w-1/2 font-Plus-Jakarta-Sans font-light lg:font-normal text-sm xs:text-base md:text-xl text-(--primary-text)">Explore a wide range of properties and services — from cozy homes to commercial spaces, land, and trusted professionals ready to bring your vision to life.</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-Plus-Jakarta-Sans font-medium text-xl text-(--primary-text) capitalize mb-2">browse by categories</h2>
                        <div className="w-full flex items-center gap-6 overflow-x-auto scrollbar-none">
                            <Carousel
                                carouselContainerClasses={'relative w-full'}
                                carouselClasses={"relative w-full flex justify-between gap-6 overflow-x-scroll scrollbar-none"}
                            >
                                <div className="min-w-fit p-5 rounded-3xl bg-[rgb(37,36,34,0.6)]">
                                    <h4 className="font-Plus-Jakarta-Sans font-medium text-xl text-(--primary-text) capitalize mb-1">residential</h4>
                                    <h5 className="font-Plus-Jakarta-Sans font-light text-sm text-(--primary-text) mb-5">Browse more than <span className="text-(--primary-color) font-bold">1k</span> properties</h5>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <PiStarFill className="text-xl text-(--primary-color)"/>
                                            <span className="font-Plus-Jakarta-Sans font-medium capitalize text-xs text-(--primary-text)">4.5/5</span>
                                        </div>
                                        <Link to='/listings'>
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full border-1 border-(--primary-color) text-(--primary-color) duration-300 ease-in-out hover:bg-(--primary-color) hover:text-(--primary-text) hover:scale-95 cursor-pointer">
                                                <PiArrowUpRight className="text-lg"/>
                                            </div>
                                        </Link>
                                    </div>

                                </div>
                                <div className="min-w-fit p-5 rounded-3xl bg-[rgb(37,36,34,0.6)]">
                                    <h4 className="font-Plus-Jakarta-Sans font-medium text-xl text-(--primary-text) capitalize mb-1">industerial</h4>
                                    <h5 className="font-Plus-Jakarta-Sans font-light text-sm text-(--primary-text) mb-5">Browse more than <span className="text-sm text-(--primary-color) font-bold">1k</span> properties</h5>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <PiStarFill className="text-xl text-(--primary-color)"/>
                                            <span className="font-Plus-Jakarta-Sans font-medium capitalize text-xs text-(--primary-text)">4.5/5</span>
                                        </div>
                                        <Link to="listings">
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full border-1 border-(--primary-color) text-(--primary-color) duration-300 ease-in-out hover:bg-(--primary-color) hover:text-(--primary-text) hover:scale-95 cursor-pointer">
                                                <PiArrowUpRight className="text-lg"/>
                                            </div>
                                        </Link>
                                    </div>

                                </div>
                                <div className="min-w-fit p-5 rounded-3xl bg-[rgb(37,36,34,0.6)]">
                                    <h4 className="font-Plus-Jakarta-Sans font-medium text-xl text-(--primary-text) capitalize mb-1">commercial</h4>
                                    <h5 className="font-Plus-Jakarta-Sans font-light text-sm text-(--primary-text) mb-5">Browse more than <span className="text-(--primary-color) font-bold">1k</span> properties</h5>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <PiStarFill className="text-xl text-(--primary-color)"/>
                                            <span className="font-Plus-Jakarta-Sans font-medium capitalize text-xs text-(--primary-text)">4.5/5</span>
                                        </div>
                                        <Link to="listings">
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full border-1 border-(--primary-color) text-(--primary-color) duration-300 ease-in-out hover:bg-(--primary-color) hover:text-(--primary-text) hover:scale-95 cursor-pointer">
                                                <PiArrowUpRight className="text-lg"/>
                                            </div>
                                        </Link>
                                    </div>

                                </div>
                                <div className="min-w-fit p-5 rounded-3xl bg-[rgb(37,36,34,0.6)]">
                                    <h4 className="font-Plus-Jakarta-Sans font-medium text-xl text-(--primary-text) capitalize mb-1">investment</h4>
                                    <h5 className="font-Plus-Jakarta-Sans font-light text-sm text-(--primary-text) mb-5">Browse more than <span className="text-(--primary-color) font-bold">1k</span> properties</h5>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <PiStarFill className="text-xl text-(--primary-color)"/>
                                            <span className="font-Plus-Jakarta-Sans font-medium capitalize text-xs text-(--primary-text)">4.5/5</span>
                                        </div>
                                        <Link to="listings">
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full border-1 border-(--primary-color) text-(--primary-color) duration-300 ease-in-out hover:bg-(--primary-color) hover:text-(--primary-text) hover:scale-95 cursor-pointer">
                                                <PiArrowUpRight className="text-lg"/>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="min-w-fit p-5 rounded-3xl bg-[rgb(37,36,34,0.6)]">
                                    <h4 className="font-Plus-Jakarta-Sans font-medium text-xl text-(--primary-text) capitalize mb-1">Agricultural</h4>
                                    <h5 className="font-Plus-Jakarta-Sans font-light text-sm text-(--primary-text) mb-5">Browse more than <span className="text-(--primary-color) font-bold">1k</span> properties</h5>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <PiStarFill className="text-xl text-(--primary-color)"/>
                                            <span className="font-Plus-Jakarta-Sans font-medium capitalize text-xs text-(--primary-text)">4.5/5</span>
                                        </div>
                                        <Link to="listings">
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full border-1 border-(--primary-color) text-(--primary-color) duration-300 ease-in-out hover:bg-(--primary-color) hover:text-(--primary-text) hover:scale-95 cursor-pointer">
                                                <PiArrowUpRight className="text-lg"/>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full"> 
                <div className="container mx-auto w-ful my-18 xs:my-22 xs:py-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
                        <div className="flex flex-col gap-2 mb-3 sm:mb-0">
                            <h2 className="font-Playfair font-medium text-4xl xs:text-5xl sm:text-6xl text-(--primary-text) capitalize">residences</h2>
                            <h3 className="font-Plus-Jakarta-Sans font-light text-base xs:text-lg sm:text-xl text-(--secondary-text) first-letter:capitalize">Here are some of our popular available residences.</h3>
                        </div>
                        <Link to="listings">
                            <span className="flex items-center gap-1 font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--primary-color) capitalize hover:border-b">
                                explore all
                                <PiArrowUpRight className="text-xl"/>
                            </span>
                        </Link>
                    </div>
                    <Carousel
                        carouselContainerClasses={'relative'}
                        carouselClasses={"relative w-full flex justify-between gap-4 xxl:gap-6 overflow-x-scroll scrollbar-none"}
                    >
                        {
                                properties.map((property, idx) => {
                                    return (
                                        <div key={idx} className={`carousel-card`}>
                                            <div className="relative w-full h-68 overflow-hidden object-cover">
                                                <img src={property.propertyImages[0]} alt="image" loading="lazy" className="w-full"/>
                                                <div className="absolute w-full h-20 sm:h-22 xl:h-16 bottom-0 left-0">
                                                    <img src='/card-wave.webp' alt="image" className="absolute left-0 top-0 w-full"/>
                                                    <span className="absolute top-1/2 -translate-y-1/2 right-5 font-Plus-Jakarta-Sans font-semibold text-lg text-(--primary-text)">{ property.forSale }$</span>
                                                </div>
                                            </div>
                                            <div className="w-full h-full p-5 pt-2">
                                                <div className="flex flex-col gap-1 mb-5">
                                                    <h2 className="font-Playfair font-medium text-2xl text-(--primary-text) capitalize mb-1">{ property.name }</h2>
                                                    <span className="inline-block h-1 w-1/2 rounded-full bg-linear-to-r from-transparent via-(--primary-color) to-transparent"></span>
                                                </div>
                                                <ul className="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
                                                    <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                                                        <PiBed className="text-xl"/>
                                                        <span className="font-Plus-Jakarta-Sans font-light text-base"><span className="">{ property.rooms }</span> bed</span>
                                                    </li>
                                                    <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                                                        <PiBathtub className="text-xl"/>
                                                        <span className="font-Plus-Jakarta-Sans font-light text-base"><span className="">{ property.bathrooms }</span> bath</span>
                                                    </li>
                                                    <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                                                        <PiGarage className="text-xl"/>
                                                        <span className="font-Plus-Jakarta-Sans font-light text-base"><span className="">{ property.garages }</span> garages</span>
                                                    </li>
                                                    <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                                                        <PiRulerDuotone className="text-xl"/>
                                                        <span className="font-Plus-Jakarta-Sans font-light text-base"><span className="">{ property.area }</span> sqft</span>
                                                    </li>
                                                </ul>
                                                <p className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) first-letter:capitalize line-clamp-2 mb-6">{ property.description }</p>
                                                <Link to={`/listing/${property._id}`}>
                                                    <button className="px-10 py-2.5 lg:py-3 border-2 rounded-3xl font-Playfair text-xl capitalize font-bold bg-(--primary-color) text-(--black-color) border-(--primary-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95 hover:bg-transparent hover:text-(--primary-color)">view more</button>
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                    </Carousel>
                </div>
            </section>
            <section className="w-full"> 
                <div className="relative container mx-auto w-ful xs:my-22 xs:py-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-3 sm:mb-10">
                        <div className="flex flex-col gap-2 mb-3 sm:mb-0">
                            <h2 className="font-Playfair font-medium text-4xl xs:text-5xl sm:text-6xl text-(--primary-text) capitalize">Our Reviews</h2>
                            <h3 className="font-Plus-Jakarta-Sans font-light text-base xs:text-base sm:text-xl text-(--secondary-text) first-letter:capitalize">Hear Directly From Those Who Know Us Best</h3>
                        </div>
                        <div className="absolute sm:relative -bottom-14 xs:-bottom-4 sm:-bottom-0 left-1/2 sm:left-0 -translate-x-1/2 sm:-translate-x-0 flex items-center gap-3">
                            <button name="leftArrow" className="w-12 h-12 sm:w-14  sm:h-14 flex items-center justify-center rounded-full bg-(--primary-color) border border-(--primary-color) duration-300 ease-in-out hover:scale-90 hover:bg-transparent cursor-pointer">
                                <PiArrowLeft className="text-2xl text-(--primary-text)" />
                            </button>
                            <button name="rightArrow" className="w-12 h-12 sm:w-14  sm:h-14 flex items-center justify-center rounded-full bg-(--primary-color) border border-(--primary-color) duration-300 ease-in-out hover:scale-90 hover:bg-transparent cursor-pointer">
                                <PiArrowRight className="text-2xl text-(--primary-text)" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full px-3 xs:px-6 py-8 xs:py-14 bg-gradient-to-r from-[#B9BBBD]/25 to-transparent rounded-3xl">
                        <div className="w-full flex items-center gap-5 overflow-x-scroll scrollbar-none">
                            <div className="carousel-card font-Plus-Jakarta-Sans py-8 px-5">
                                <h4 className="text-(--primary-text) text-2xl font-medium mb-3 capitalize">“Found my dream condo through this platform!”</h4>
                                <h5 className="text-(--secondary-text) text-lg font-light mb-5">
                                    The search filters were incredibly detailed and helped me narrow down exactly what I was looking for. The virtual tour feature saved me so much time by letting me eliminate properties before scheduling in-person visits. 
                                </h5>
                                <div className="flex items-center gap-3">
                                    <img src="/Ellipse34.png" alt="image" className="w-18 h-18 rounded-full border border-(--primary-color)" />
                                    <div className="flex flex-col">
                                        <h3 className="text-xl text-(--primary-text) capitalize">Sarah Martinez</h3>
                                        <h3 className="text-base text-(--secondary-text) capitalize">digital marketer</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-card font-Plus-Jakarta-Sans py-8 px-5">
                                <h4 className="text-(--primary-text) text-2xl font-medium mb-3 capitalize">“Found my dream condo through this platform!”</h4>
                                <h5 className="text-(--secondary-text) text-lg font-light mb-5">
                                    The search filters were incredibly detailed and helped me narrow down exactly what I was looking for. The virtual tour feature saved me so much time by letting me eliminate properties before scheduling in-person visits. 
                                </h5>
                                <div className="flex items-center gap-3">
                                    <img src="/Ellipse34.png" alt="image" className="w-18 h-18 rounded-full border border-(--primary-color)" />
                                    <div className="flex flex-col">
                                        <h3 className="text-xl text-(--primary-text) capitalize">Sarah Martinez</h3>
                                        <h3 className="text-base text-(--secondary-text) capitalize">digital marketer</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-card font-Plus-Jakarta-Sans py-8 px-5">
                                <h4 className="text-(--primary-text) text-2xl font-medium mb-3 capitalize">“Found my dream condo through this platform!”</h4>
                                <h5 className="text-(--secondary-text) text-lg font-light mb-5">
                                    The search filters were incredibly detailed and helped me narrow down exactly what I was looking for. The virtual tour feature saved me so much time by letting me eliminate properties before scheduling in-person visits. 
                                </h5>
                                <div className="flex items-center gap-3">
                                    <img src="/Ellipse34.png" alt="image" className="w-18 h-18 rounded-full border border-(--primary-color)" />
                                    <div className="flex flex-col">
                                        <h3 className="text-xl text-(--primary-text) capitalize">Sarah Martinez</h3>
                                        <h3 className="text-base text-(--secondary-text) capitalize">digital marketer</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-card font-Plus-Jakarta-Sans py-8 px-5">
                                <h4 className="text-(--primary-text) text-2xl font-medium mb-3 capitalize">“Found my dream condo through this platform!”</h4>
                                <h5 className="text-(--secondary-text) text-lg font-light mb-5">
                                    The search filters were incredibly detailed and helped me narrow down exactly what I was looking for. The virtual tour feature saved me so much time by letting me eliminate properties before scheduling in-person visits. 
                                </h5>
                                <div className="flex items-center gap-3">
                                    <img src="/Ellipse34.png" alt="image" className="w-18 h-18 rounded-full border border-(--primary-color)" />
                                    <div className="flex flex-col">
                                        <h3 className="text-xl text-(--primary-text) capitalize">Sarah Martinez</h3>
                                        <h3 className="text-base text-(--secondary-text) capitalize">digital marketer</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-card font-Plus-Jakarta-Sans py-8 px-5">
                                <h4 className="text-(--primary-text) text-2xl font-medium mb-3 capitalize">“Found my dream condo through this platform!”</h4>
                                <h5 className="text-(--secondary-text) text-lg font-light mb-5">
                                    The search filters were incredibly detailed and helped me narrow down exactly what I was looking for. The virtual tour feature saved me so much time by letting me eliminate properties before scheduling in-person visits. 
                                </h5>
                                <div className="flex items-center gap-3">
                                    <img src="/Ellipse34.png" alt="image" className="w-18 h-18 rounded-full border border-(--primary-color)" />
                                    <div className="flex flex-col">
                                        <h3 className="text-xl text-(--primary-text) capitalize">Sarah Martinez</h3>
                                        <h3 className="text-base text-(--secondary-text) capitalize">digital marketer</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-card font-Plus-Jakarta-Sans py-8 px-5">
                                <h4 className="text-(--primary-text) text-2xl font-medium mb-3 capitalize">“Found my dream condo through this platform!”</h4>
                                <h5 className="text-(--secondary-text) text-lg font-light mb-5">
                                    The search filters were incredibly detailed and helped me narrow down exactly what I was looking for. The virtual tour feature saved me so much time by letting me eliminate properties before scheduling in-person visits. 
                                </h5>
                                <div className="flex items-center gap-3">
                                    <img src="/Ellipse34.png" alt="image" className="w-18 h-18 rounded-full border border-(--primary-color)" />
                                    <div className="flex flex-col">
                                        <h3 className="text-xl text-(--primary-text) capitalize">Sarah Martinez</h3>
                                        <h3 className="text-base text-(--secondary-text) capitalize">digital marketer</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full px-4 xs:px-0"> 
                <div className="container relative mx-auto w-full lg:h-[480px] xxl:h-[540px] flex justify-between overflow-hidden bg-(--black-color) object-center rounded-4xl my-22 p-8 md:p-10 lg:p-12">
                    <div className="w-full lg:w-1/2 h-full flex flex-col justify-center gap-2">
                        <div className="relative">
                            <h2 className="font-Plus-Jakarta-Sans font-bold text-2xl xs:text-3xl sm:text-5xl lg:text-4xl xl:text-5xl text-(--primary-text) capitalize leading-10 sm:leading-15 lg:leading-13 xl:leading-15 text-center lg:text-start">
                                The Smarter Way to <br /> Buy & Sell Real Estate
                            </h2>
                            <img src="/asterisk_1.svg" alt="icon" loading="lazy" className="absolute top-2 -right-2 xs:right-4 md:right-14 xl:right-3 xxl:right-18 rotate-45"/>
                            <img src="/asterisk_1.svg" alt="icon" loading="lazy" className="lg:hidden absolute -bottom-12 md:left-18 xl:right-3 xxl:right-18 rotate-45 scale-75"/>
                        </div>
                        <h3 className="mx-auto lg:mx-0 w-2/3 font-Plus-Jakarta-Sans font-normal text-base xs:text-lg sm:text-xl lg:text-lg xl:text-xl text-(--secondary-text) mb-8 lg:mb-16 text-center lg:text-start">No hidden fees, transparent process, and support every step of the way</h3>
                        <div className="flex items-center justify-center lg:justify-start gap-6">
                            <Link to=''>
                                <button className="mainBtn">
                                    get started
                                </button>
                            </Link>
                            <Link to='' className="hidden xs:block">
                                <button className="font-Plus-Jakarta-Sans font-normal text-xl text-(--primary-text) capitalize underline cursor-pointer">
                                    know more
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full bg-[url(/banner-image.png)] bg-no-repeat bg-right bg-contain">
                        <img src="/asterisk_2.svg" alt="icon" loading="lazy" className="absolute lg:bottom-11 lg:-left-14 xl:left-2 w-14"/>

                        <div className="absolute lg:bottom-10 lg:left-3 xl:bottom-12 xl:left-24 flex items-center gap-2 py-2 px-3 bg-(--primary-text) rounded-2xl lg:scale-90 xl:scale-100">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[rgba(81,194,6,0.1)]">
                                <PiBuildings  className="text-3xl text-(--primary-color)"/>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-lg text-(--black-color) font-Plus-Jakarta-Sans font-bold leading-6">+1k</h3>
                                <h4 className="text-sm text-(--blaack-color) font-Plus-Jakarta-Sans font-normal capitalize">available properties</h4>
                            </div>
                        </div>

                        <div className="absolute lg:bottom-30 lg:-left-12 xl:bottom-36 xl:left-6 flex items-center gap-2 py-2 px-3 bg-(--primary-text) rounded-2xl lg:scale-90 xl:scale-100">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[rgba(81,194,6,0.1)]">
                                <PiUsers  className="text-3xl text-(--primary-color)"/>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-lg text-(--black-color) font-Plus-Jakarta-Sans font-bold leading-6">+13k</h3>
                                <h4 className="text-sm text-(--blaack-color) font-Plus-Jakarta-Sans font-normal capitalize">active members</h4>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <Footer />
        </main>
    )
}

export default Home;