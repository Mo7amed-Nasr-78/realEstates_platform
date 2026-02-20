import { useEffect, useState, useRef } from "react";
import { useProps } from "../components/PropsProvider";
import { useParams, Link, useNavigate } from "react-router-dom";

import {
    PiStarFill,
    PiStar,
    PiPaperPlaneTilt,
    PiHeartFill,
    PiHeart,
    PiMapPin,
    PiBed,
    PiBathtub,
    PiGarage,
    PiRuler,
    PiClock,
    PiArrowUp,
    PiArrowDown,
    PiCaretDown,
    PiCalendarLight
} from 'react-icons/pi';
import api, { getAccessToken } from "../../utils/axiosInstance";
// Components
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Carousel from "../components/Carousel";
import Alert from '../components/Alert';
import BookingModal from "../components/BookingModal";

function PropertyDetails() {

    // Router states
    const { id } = useParams();
    const navigate = useNavigate();
    const { 
        // token, /
        user, 
        favorites, 
        setNewFavorite,
        setIsLoading
    } = useProps();

    // Component states
    const [ property, setProperty ] = useState(null); 
    const [ properties, setProperties ] = useState(null); 
    const [ imgView, setImgView ] = useState(0); 
    const [ readMore, setReadMore ] = useState(false);
    const [ scrolled, setScrolled ] = useState(0);
    const [ openBookingModal, setOpenBookingModal ] = useState(false);

    // Component Refs
    const carouselRef = useRef(null);
    const carouselCardRef = useRef(null);
    const carouselUpRef = useRef(null);
    const carouselDownRef = useRef(null);
    
    useEffect(() => {
        const getProperty = async () => {
            try {
                const { data: { property } } = await api.get(
                    `/api/property/${id}/details`
                );

                setProperty(property);
            } catch (err) {
                if (err.response) {
                    Alert('error', err.response.data.message);
                } else {
                    Alert("error", err.message);
                }
            } 
        }
        getProperty()

        const getProperties = async () => {
            try {
                const { data: { properties } } = await api.get(
                    `/api/property/getAll`,
                    {
                        params: {
                            page: 1,
                            perPage: 6,
                        }
                    }
                );
                setProperties(properties);
            } catch (err) {
                console.log(err)
            } 
        }
        getProperties()
    }, [])

    const handleCarouselUp = () => {
        const carousel = carouselRef.current;
        const arrowTop = carouselUpRef.current;
        const arrowDown = carouselDownRef.current;
        const gap = parseInt(window.getComputedStyle(carousel).gap);

        if (carousel) {
            let newScrolled = 0;
            if (scrolled > 0)  {
                newScrolled = scrolled - (carousel.clientHeight + gap);
                carousel.scrollTo({
                    behavior: 'smooth',
                    top: newScrolled
                })
                setScrolled(newScrolled);
            }

            if (arrowTop && newScrolled <= 0) {
                arrowTop.parentElement.classList.add('hidden');
                arrowTop.parentElement.classList.remove('flex', 'justify-center');
            }
            
            if (arrowDown && newScrolled <= 0) {
                arrowDown.parentElement.classList.remove('hidden');
                arrowDown.parentElement.classList.add('flex', 'justify-center');
            }
        }
    }

    const handleCarouselDown = () => {
        const carousel = carouselRef.current;
        const arrowTop = carouselUpRef.current;
        const arrowDown = carouselDownRef.current;
        const gap = parseInt(window.getComputedStyle(carousel).gap);
        
        if (carousel) {
            const carouselHeight = carousel.scrollHeight - carousel.clientHeight;
            let newScrolled = 0;
            if (scrolled < carouselHeight)  {
                newScrolled = scrolled + carousel.clientHeight + gap;
                carousel.scrollTo({
                    behavior: 'smooth',
                    top: newScrolled
                })
                setScrolled(newScrolled);
            }

            if (arrowTop && newScrolled > 0) {
                arrowTop.parentElement.classList.remove('hidden');
                arrowTop.parentElement.classList.add('flex', 'justify-center');
            }
            
            if (arrowDown && newScrolled >= carouselHeight) {
                arrowDown.parentElement.classList.add('hidden');
                arrowDown.parentElement.classList.remove('flex', 'justify-center');
            }
        }

    }

    const onConfirm = async (bookingInfo) => {
        if (!getAccessToken()) {
            Alert('warning', 'You need to sign in first');
            setOpenBookingModal(false);
            return;
        }

        setIsLoading(true);
        try {
            const { data: { message } } = await api.post(
                `/api/booking/create`,
                {
                    ...bookingInfo,
                    propertyId: id,
                },
            );

            Alert('success', message);
        } catch (err) {
            if (err.response) {
                Alert('error', err.response.data.message);
            } else {
                Alert('error', err.message);
            }
        } finally {
            setIsLoading(false);
            setOpenBookingModal(!openBookingModal);
        }
    }

    const createNewChat = async (otherUserId) =>{
        if (!getAccessToken()) {
            Alert('warning', 'You need to sign in first');
            return;
        }

		try {
			const { data: { chat } } = await api.get(
				`/api/chat/create/${otherUserId}`,
			);
			navigate(`/messages/${chat._id}`)
		} catch (err) {
            if (err.response) {
                Alert('error', err.response.data.message);
            } else {
                Alert('error', err.message);
            }
		}
	}

    return (
        <main className={`${openBookingModal? 'overflow-hidden': ''}`}>
            <Header />
            <section className="w-full mt-26 lg:mt-36 mb-25">
                <div className="container mx-auto px-5 md:px-0">
                    <div className="flex flex-col gap-1 mb-8">
                        <h2 className="font-Playfair font-medium text-4xl text-(--primary-text) capitalize">Residence Details</h2>
                        <h4 className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) lowercase first-letter:capitalize">Explore your living space information with ease and precision</h4>
                    </div>

                    <div className="relative min-h-screen grid grid-cols-12 grid-rows-1 gap-6">
                        {
                            property && properties?
                                <>
                                    <div className="relative col-span-12 lg:col-span-8 row-span-1 h-full">
                                        <div className="relative w-full h-90 md:h-140 rounded-4xl overflow-hidden border border-(--primary-color) before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-b before:from-transparent before:to-(--bg-color)">
                                            <img src={property.propertyImages[imgView]} alt="image" loading="lazy" className="w-full h-full object-cover object-center"/>
                                            <div className="absolute w-full top-6 flex items-center justify-end sm:justify-between px-6">
                                                <div className="hidden sm:flex items-center gap-4">
                                                    <div className={`${!property.forSale? 'hidden': 'flex items-center gap-2'} py-2 px-3 rounded-xl bg-(--primary-text)`}>
                                                        <div className="w-2 h-2 rounded-full bg-(--primary-color)"></div>
                                                        <span className="font-Plus-Jakarta-Sans font-medium text-sm text-(--black-color) capitalize">for sale</span>
                                                    </div>
                                                    <div className={`${!property.forRent? 'hidden': 'flex items-center gap-2'} py-2 px-3 rounded-xl bg-(--primary-text)`}>
                                                        <div className="w-2 h-2 rounded-full bg-(--primary-color)"></div>
                                                        <span className="font-Plus-Jakarta-Sans font-medium text-sm text-(--black-color) capitalize">for rent</span>
                                                    </div>
                                                </div>
                                                <div onClick={() => setNewFavorite(property)} className="group w-10 h-10 flex items-center justify-center rounded-full bg-(--secondary-color) text-2xl text-(--primary-text) cursor-pointer duration-300 ease-in-out hover:scale-95">
                                                    { 
                                                        favorites?.some((favorite) => favorite?._id === property?._id)? <PiHeartFill />: <PiHeart />
                                                    }
                                                </div>
                                            </div>
                                            <Carousel
                                                carouselContainerClasses={'absolute left-1/2 bottom-8 w-[90%] h-20 sm:h-28 md:h-42 -translate-x-1/2 rounded-3xl overflow-hidden'}
                                                carouselClasses={'flex items-center w-full h-full overflow-x-scroll gap-2 sm:gap-4 scrollbar-none'}
                                            >
                                                {
                                                    property?
                                                        property.propertyImages.map((item, idx) => {
                                                            return <img key={idx} src={item} loading="lazy" onClick={() => setImgView(idx)} alt="image" className="w-full h-full col-span-4 rounded-xl sm:rounded-2xl md:rounded-3xl cursor-pointer duration-300 ease-in-out hover:scale-95"/>
                                                        })
                                                    :
                                                    null
                                                }
                                            </Carousel>
                                        </div>
                                        <div className="w-full mt-5">
                                            <div className="flex flex-col md:flex-row items-start md:items-end gap-3 md:gap-1 mb-4 md:mb-2">
                                                <h1 className="font-Playfair font-medium text-4xl text-(--primary-text)">{ property.name }</h1>
                                                <span className="hidden md:block text-3xl text-(--secondary-text)"> / </span>
                                                <div className="flex items-end gap-1 m-0">
                                                    <PiMapPin className="text-2xl sm:text-xl text-(--primary-text)"/>
                                                    <span className="font-Plus-Jakarta-Sans font-normal text-base sm:text-lg text-(--secondary-text) leading-5">{ property.address }</span>
                                                </div>
                                            </div>
                                            <h2 className="font-Plus-Jakarta-Sans font-normal text-xl text-(--secondary-text) capitalize mb-4">${ property.forSale } for sale | ${ property.forRent } for rent</h2>
                                            <ul className="w-full flex items-between flex-wrap xxl:flex-nowrap gap-3 mb-6">
                                                <li className="flex flex-col items-start gap-2 px-5 py-3 rounded-2xl bg-[rgb(204,204,204,.1)]">
                                                    <PiBed className="text-2xl text-(--primary-color)"/>
                                                    <span className="font-Plus-Jakarta-Sans font-normal text-base xxl:text-lg text-(--primary-text) capitalize">bedrooms: { property.rooms }</span>
                                                </li>
                                                <li className="flex flex-col items-start gap-2 px-5 py-3 rounded-2xl bg-[rgb(204,204,204,.1)]">
                                                    <PiBathtub className="text-2xl text-(--primary-color)"/>
                                                    <span className="font-Plus-Jakarta-Sans font-normal text-base xxl:text-lg text-(--primary-text) capitalize">bathrooms: { property.bathrooms }</span>
                                                </li>
                                                <li className="flex flex-col items-start gap-2 px-5 py-3 rounded-2xl bg-[rgb(204,204,204,.1)]">
                                                    <PiGarage className="text-2xl text-(--primary-color)"/>
                                                    <span className="font-Plus-Jakarta-Sans font-normal text-base xxl:text-lg text-(--primary-text) capitalize">garages: { property.garages }</span>
                                                </li>
                                                <li className="flex flex-col items-start gap-2 px-5 py-3 rounded-2xl bg-[rgb(204,204,204,.1)]">
                                                    <PiRuler className="text-2xl text-(--primary-color)"/>
                                                    <span className="font-Plus-Jakarta-Sans font-normal text-base xxl:text-lg text-(--primary-text) capitalize">area: { property.area }</span>
                                                </li>
                                                <li className="flex flex-col items-start gap-2 px-5 py-3 rounded-2xl bg-[rgb(204,204,204,.1)]">
                                                    <PiClock className="text-2xl text-(--primary-color)"/>
                                                    <span className="font-Plus-Jakarta-Sans font-normal text-base xxl:text-lg text-(--primary-text) capitalize">year built: { property.yearBuilt }</span>
                                                </li>
                                            </ul>
                                            <div className="flex flex-col gap-4 mb-8">
                                                <h2 className="font-Plus-Jakarta-Sans font-medium text-2xl text-(--primary-text) capitalize">description</h2>
                                                <div className="flex flex-col">
                                                    <p className={`${readMore? 'line-clamp-none': 'line-clamp-4'} font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text)`}>{ property.description }</p>
                                                    <span onClick={() => { setReadMore(!readMore) }} className="font-Plus-Jakarta-Sans font-light text-base text-(--primary-text) capitalize cursor-pointer hover:underline">
                                                        { readMore? 'read less': 'read more' }
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4 mb-8">
                                                <h2 className="font-Plus-Jakarta-Sans font-medium text-2xl text-(--primary-text) capitalize">property features</h2>
                                                <ul className="grid grid-cols-12 gap-6">
                                                    {
                                                        property.propertyFeatures.map((feature, idx) => {
                                                            return (
                                                                <li key={idx} className="col-span-12 sm:col-span-6 xl:col-span-4 flex flex-col gap-1">
                                                                    <h4 className="font-Plus-Jakarta-Sans font-light text-xl text-(--primary-text) capitalize">{ feature.title }</h4>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-2 h-2 rounded-full bg-(--secondary-text)"></div>
                                                                        <h5 className="font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize">{ feature.description }</h5>
                                                                    </div>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                            <div className="flex flex-col gap-4 mb-8">
                                                <h2 className="font-Plus-Jakarta-Sans font-medium text-2xl text-(--primary-text) capitalize">neighborhood insights</h2>
                                                <ul className="flex flex-col gap-4">
                                                    {
                                                        property.neighborhoodInsights.map((insight, idx) => {
                                                            return (
                                                                <li key={idx} className="col-span-12 flex flex-col sm:flex-row gap-2 sm:gap-1">
                                                                    <h4 className="w-1/2 font-Plus-Jakarta-Sans font-light text-xl text-(--primary-text) capitalize">{ insight.title }</h4>
                                                                    <h5 className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">{ insight.description }</h5>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                            <div className="flex flex-col gap-4 mb-8">
                                                <h2 className="font-Plus-Jakarta-Sans font-medium text-2xl text-(--primary-text) capitalize">financial information</h2>
                                                <ul className="flex flex-col gap-4">
                                                    {
                                                        property.financialInfo.map((financial, idx) => {
                                                            return (
                                                                <li key={idx} className="col-span-12 flex flex-col sm:flex-row  gap-2 sm:gap-1">
                                                                    <h4 className="w-1/2 font-Plus-Jakarta-Sans font-light text-xl text-(--primary-text) capitalize">{ financial.title }</h4>
                                                                    <h5 className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">{ financial.description }</h5>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                            <div className="flex flex-col gap-4 mb-8">
                                                <h2 className="font-Plus-Jakarta-Sans font-medium text-2xl text-(--primary-text) capitalize">property history</h2>
                                                <ul className="flex flex-wrap justify-between gap-2 md:gap-4">
                                                    <li className="flex flex-col sm:flex-row  gap-2 sm:gap-1">
                                                        <h4 className="text-nowrap font-Plus-Jakarta-Sans font-light text-xl text-(--primary-text) capitalize">listed:</h4>
                                                        <h5 className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">{ property.createdAt.split('T')[0] }</h5>
                                                    </li>
                                                    <li className="flex flex-col sm:flex-row  gap-2 sm:gap-1">
                                                        <h4 className="text-nowrap font-Plus-Jakarta-Sans font-light text-xl text-(--primary-text)">Days on Market:</h4>
                                                        <h5 className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">
                                                            { new Date().getUTCDate() - new Date(property.createdAt.split('T')[0]).getUTCDate() } days
                                                        </h5>
                                                    </li>
                                                    <li className="flex flex-col sm:flex-row  gap-2 sm:gap-1">
                                                        <h4 className="text-nowrap font-Plus-Jakarta-Sans font-light text-xl text-(--primary-text) capitalize">previous sale:</h4>
                                                        <h5 className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">-------</h5>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`h-full relative col-span-12 lg:col-span-4 row-span-1 flex flex-col gap-6`}>
                                        <div className="col-span-2 rounded-3xl bg-(--secondary-color) p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="min-w-18 w-18 h-18 rounded-full overflow-hidden border border-(--primary-color)">
                                                    <img src={property.user.picture} alt="picture" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h2 className="font-Plus-Jakarta-Sans font-semibold text-xl text-(--primary-text) capitalize">{ property.user.name }</h2>
                                                    <h3 className="w-full font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize line-clamp-1">{ property.user.jobTitle }</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mb-3">
                                                <Link to={`/profile/${property.user._id}`}>
                                                    <button className="flex items-center text-(--secondary-text) hover:text-(--primary-color) hover:border-b hover:border-(--primary-color) cursor-pointer">
                                                        <span className="font-Plus-Jakarta-Sans font-normal text-sm capitalize">view profile</span>
                                                    </button>
                                                </Link>
                                                <div className="flex items-center text-base text-yellow-400">
                                                    <PiStarFill  />
                                                    <PiStarFill  />
                                                    <PiStarFill  />
                                                    <PiStar  />
                                                    <PiStar  />
                                                </div>
                                            </div>
                                            <p className="font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) first-letter:capitalize line-clamp-4 mb-6">{ property.user.aboutMe }</p>
                                            <ul className="flex flex-col gap-2 mb-6">
                                                <li className="flex items-center">
                                                    <h4 className="w-3/5 xl:w-1/2 font-Plus-Jakarta-Sans font-light text-xl lg:text-lg xl:text-xl text-(--primary-text) capitalize">languages:</h4>
                                                    <h5 className="font-Plus-Jakarta-Sans font-medium text-base text-(--secondary-text) capitalize text-wrap">
                                                        { 
                                                            property.user.languages.length > 0? 
                                                                property.user.languages.map((lang, idx) => { 
                                                                        return (
                                                                            [0,1].includes(idx) && 
                                                                            <span key={idx}>{idx === 0? `${lang} | `: lang}</span>
                                                                        )
                                                                    })
                                                                : 
                                                                'none' 
                                                        }
                                                    </h5>
                                                </li>
                                                <li className="flex items-center">
                                                    <h4 className="w-3/5 xl:w-1/2 font-Plus-Jakarta-Sans font-light text-xl lg:text-lg xl:text-xl text-(--primary-text) capitalize">Response rate:</h4>
                                                    <h5 className="font-Plus-Jakarta-Sans font-medium text-base text-(--secondary-text) capitalize">0%</h5>
                                                </li>
                                                <li className="flex items-center">
                                                    <h4 className="w-3/5 xl:w-1/2 font-Plus-Jakarta-Sans font-light text-xl lg:text-lg xl:text-xl text-(--primary-text) capitalize">Response time:</h4>
                                                    <h5 className="font-Plus-Jakarta-Sans font-medium text-base text-(--secondary-text) capitalize">within an hour</h5>
                                                </li>
                                                <li className="flex items-center">
                                                    <h4 className="w-3/5 xl:w-1/2 font-Plus-Jakarta-Sans font-light text-xl lg:text-lg xl:text-xl text-(--primary-text) capitalize">Properties sold:</h4>
                                                    <h5 className="font-Plus-Jakarta-Sans font-medium text-base text-(--secondary-text) capitalize">more 13k</h5>
                                                </li>
                                            </ul>
                                            <div className="flex items-center justify-between gap-3">
                                                {
                                                    user?._id === property?.user._id?
                                                        <Link to={'/stats'} className="w-full">
                                                            <button className="w-full py-3 border-2 rounded-3xl font-Playfair text-xl capitalize font-semibold bg-(--primary-color) text-(--black-color) border-(--primary-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95 hover:bg-transparent hover:text-(--primary-color)">
                                                                property stats
                                                            </button>
                                                        </Link>
                                                    :
                                                    <>
                                                        <button onClick={() => setOpenBookingModal(!openBookingModal)} className="w-full py-3 border-2 rounded-3xl font-Playfair text-xl capitalize font-semibold bg-(--primary-color) text-(--black-color) border-(--primary-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95 hover:bg-transparent hover:text-(--primary-color)">
                                                            schedule visit
                                                        </button>
                                                        <div onClick={() => createNewChat(property.user._id)} className="min-w-14 min-h-14 w-14 h-14 flex items-center justify-center rounded-full text-3xl text-(--black-color) bg-(--primary-color) cursor-pointer duration-300 ease-in-out hover:scale-95">
                                                            <PiPaperPlaneTilt />
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        <div className="w-full h-full">
                                            <h3 className="font-Plus-Jakarta-Sans font-medium text-xl text-(--primary-text) capitalize mb-3">recommended properties</h3>
                                            <div className="relative w-full">
                                                <div className="hidden group absolute top-0 left-0 duration-300 ease-in-out w-full h-42 bg-linear-to-b from-(--bg-color) to-transparent z-10">
                                                    <div ref={carouselUpRef} onClick={handleCarouselUp} className="w-14 h-14 flex items-center justify-center translate-y-10 group-hover:translate-y-20 rounded-full border border-(--primary-text) text-3xl text-(--primary-text) duration-300 ease-in-out hover:bg-(--primary-color) cursor-pointer hover:scale-95 z-10">
                                                        <PiArrowUp />
                                                    </div>
                                                </div>
                                                <ul ref={carouselRef} className="sm:px-5 lg:px-0 w-full max-h-340 h-full flex flex-col gap-4 overflow-y-scroll scrollbar-none">
                                                    {
                                                        properties.map((property, idx) => {
                                                            return (
                                                                <Link key={idx} to={`/listing/${property._id}`}>
                                                                    <li ref={carouselCardRef} className="relative w-full rounded-3xl p-4 bg-(--secondary-color) duration-300 ease-in-out hover:scale-[98%] cursor-pointer">
                                                                        <img src={property.propertyImages[0]} alt="image" className="w-full h-68 object-cover rounded-2xl mb-2"/>
                                                                        <h3 className="font-Plus-Jakarta-Sans font-medium text-2xl text-(--primary-text) capitalize">{ property.name }</h3>
                                                                        <h4 className="font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize mb-2">{ property.forSale? 'for sale': '' } - { property.forRent? 'for rent': '' }</h4>
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
                                                                                <PiRuler className="text-xl"/>
                                                                                <span className="font-Plus-Jakarta-Sans font-light text-base"><span className="">{ property.area }</span> sqft</span>
                                                                            </li>
                                                                        </ul>
                                                                        <h5 className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) line-clamp-3 first-letter:capitalize">{ property.description }</h5>
                                                                    </li>
                                                                </Link>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                                <div className="group absolute bottom-0 left-0 duration-300 ease-in-out w-full h-42 flex justify-center bg-linear-to-t from-(--bg-color) to-transparent z-10">
                                                    <div ref={carouselDownRef} onClick={handleCarouselDown} className="w-14 h-14 flex items-center justify-center translate-y-20 group-hover:translate-y-10 rounded-full border border-(--primary-text) text-3xl text-(--primary-text) duration-300 ease-in-out hover:bg-(--primary-color) cursor-pointer hover:scale-95 z-10">
                                                        <PiArrowDown />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            :
                                <Loader />
                        }
                    </div>

                </div>
            </section>
            <Footer />
            { openBookingModal && <BookingModal onConfirm={(value) => onConfirm(value)} onClose={() => setOpenBookingModal(!openBookingModal)} /> }
        </main>
    )
}

export default PropertyDetails;