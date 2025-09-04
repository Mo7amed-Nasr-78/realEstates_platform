import { useEffect, useMemo, useState } from "react";
import { useProps } from "../components/PropsContext";
import { Link } from "react-router-dom";
import axios from 'axios';
import { 
    PiFunnel,
    PiBed,
    PiBathtub,
    PiGarage,
    PiRulerDuotone,
    PiHeart,
    PiHeartFill,
    PiMagnifyingGlass,
    PiCaretDown,
} from 'react-icons/pi';
import Header from "../components/Header/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Pagination from "../components/Paginations";
import Dropdown from "../components/Dropdown";
import { priceRange, propertyCategories, roomsAndBathrooms } from "../../Data/Data";

function Listings() {

    const { url, user, favorites, setNewFavorite, page } = useProps();
    const [ isLoading, setIsLoading ] = useState(true);
    const [ showFilter, setShowFilter ] = useState(false);
    const [ properties, setProperties ] = useState([]);
    const [ filter, setFilter ] = useState({ query: '', min: '', max: '', type: '', rooms: '', bathrooms: '' });

    useEffect(() => {

        const getProperties = async () => {
            setIsLoading(true);
            try {
                const res = (await axios.get(
                    `${url}/api/property/getAll?q=${filter.query}&minPrice=${filter.min}&maxPrice=${filter.max}&category=${filter.type}&rooms=${filter.rooms}&bathrooms=${filter.bathrooms}`, 
                    { 
                        withCredentials: true,
                        params: {
                            page,
                        },
                    })
                ).data
                setProperties(res.properties);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
        getProperties();

    }, [user, page, filter]);

    const updateFilter = useMemo((field, value) => {

        if (field === 'price') {
            switch(value) {
                case "$100k - $200k":
                    setFilter((prevs) => {
                        return {...prevs, min: 100000, max: 200000}
                    })
                    break;
                case "$200k - $300k":
                    setFilter((prevs) => {
                        return {...prevs, min: 200000, max: 300000}
                    });
                    break;
                case "$300k - $400k":
                    setFilter((prevs) => {
                        return {...prevs, min: 300000, max: 400000}
                    });
                    break;
                case "$400k - $1m":
                    setFilter((prevs) => {
                        return {...prevs, min: 400000, max: 1000000}
                    });
                    break;
                default:
                    setFilter((prevs) => {
                        return {...prevs, min: '', max: ''}
                    });
                    break;
            }
        }

        if (field === 'rooms&bathrooms') {
            switch(value) {
                case '0 - 5':
                    setFilter((prevs) => {
                        return {...prevs, rooms: 5, bathrooms: 5}
                    });
                    break;
                case '0 - 10':
                    setFilter((prevs) => {
                        return {...prevs, rooms: 10, bathrooms: 10}
                    });
                    break;
                case '0 - 20':
                    setFilter((prevs) => {
                        return {...prevs, rooms: 20, bathrooms: 20}
                    });
                    break;
                default:
                    setFilter((prevs) => {
                        return {...prevs, rooms: '', bathrooms: ''}
                    });
                    break;
            }
        }

        setFilter((prevs) => {
            return {...prevs, [field]: value === 'all'? '': value}
        });

    }, []);


    return (
        <main>
            <Header />
            <section className="w-full mt-26 lg:mt-36 mb-25">
                <div className="container mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-0 mb-5">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-Playfair font-medium text-4xl text-(--primary-text) capitalize">our all residences</h2>
                            <h4 className="font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) capitalize">{ properties.length } results of residences</h4>
                        </div>
                        <button onClick={() => { showFilter? setShowFilter(false): setShowFilter(true) }} className="w-fit flex items-center gap-1 text-(--secondary-text) px-5 py-3 border border-(--secondary-text) duration-300 ease-in-out hover:text-(--primary-color) hover:border-(--primary-color) hover:scale-95 cursor-pointer rounded-[20px]">
                            <PiFunnel className="text-2xl"/>
                            <span className="font-Playfair font-normal text-lg capitalize">filter</span>
                        </button>
                    </div>
                    <div className={`${showFilter? 'block': 'hidden'} w-full flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-3 bg-[rgb(204,204,204,0.08)] rounded-3xl mb-5 p-3`}>
                        <div className="w-full sm:w-1/2 py-3 flex items-center gap-2 border border-(--secondary-text) rounded-2xl px-2">
                            <PiMagnifyingGlass className="text-xl text-(--primary-color)" />
                            <input onChange={(event) => updateFilter('query', event.target.value)} value={filter.query} name="query" type="text" autoComplete="off" placeholder="Search about your place ..." className="w-full h-full font-Plus-Jakarta-Sans font-light text-base text-(--primary-text) placeholder:text-base placeholder:capitalize focus:outline-none" />
                        </div>
                        <Dropdown
                            items={priceRange}
                            classes={'left-0 w-42'}
                            onSelect={(value) => updateFilter('price', value)}
                        >
                            <button className="flex items-center gap-2 py-2.5 px-4 text-(--secondary-text) border border-(--primary-text) rounded-2xl duration-300 ease-in-out hover:scale-95 cursor-pointer">
                                <span className="font-Plus-Jakarta-Sans text-base capitalize">price</span>
                                <PiCaretDown className="text-xl"/>
                            </button>
                        </Dropdown>
                        <Dropdown
                            items={roomsAndBathrooms}
                            classes={'left-0 w-42'}
                            onSelect={(value) => updateFilter('rooms&bathrooms', value)}
                        >
                            <button className="flex items-center gap-2 py-2.5 px-4 text-(--secondary-text) border border-(--primary-text) rounded-2xl duration-300 ease-in-out hover:scale-95 cursor-pointer">
                                <span className="font-Plus-Jakarta-Sans text-base capitalize">rooms & bathrooms</span>
                                <PiCaretDown className="text-xl"/>
                            </button>
                        </Dropdown>
                        <Dropdown
                            items={propertyCategories}
                            classes={'left-0 w-42'}
                            onSelect={(value) => updateFilter('type', value)}
                        >
                            <button className="flex items-center gap-2 py-2.5 px-4 text-(--secondary-text) border border-(--primary-text) rounded-2xl duration-300 ease-in-out hover:scale-95 cursor-pointer">
                                <span className="font-Plus-Jakarta-Sans text-base capitalize">type</span>
                                <PiCaretDown className="text-xl"/>
                            </button>
                        </Dropdown>
                    </div>
                    <div className={`${isLoading? 'h-screen': ''} relative w-full grid grid-cols-12 gap-5`}>
                        {
                            !isLoading?
                                properties.length < 1?
                                    <div className="col-span-12 h-[50vh] flex items-center justify-center">
                                        <h1 className="col-span-12 font-Plus-Jakarta-Sans font-medium text-xl text-(--primary-text) text-center capitalize">Not Properties found</h1>
                                    </div>
                                :
                                    properties.map((property, index) => {
                                        return (
                                            <div key={index} className="col-span-12 sm:col-span-6 lg:col-span-4 relative w-full h-full bg-(--secondary-color) p-3 md:p-4 rounded-3xl sm:rounded-4xl duration-300 ease-in-out hover:scale-[99%]" data-propertyid={property._id}>
                                                <h4 className="absolute top-5 left-5 sm:top-8 sm:left-8 font-Plus-Jakarta-Sans font-medium text-base text-(--primary-text) bg-(--secondary-color) py-2 px-4 rounded-2xl">{ property.forSale }$</h4>
                                                <div onClick={() => setNewFavorite(property)} className="absolute right-5 top-5 sm:right-8 sm:top-8 w-10 h-10 flex items-center justify-center rounded-full bg-(--secondary-color) text-2xl text-(--primary-text) cursor-pointer duration-300 ease-in-out hover:scale-95">
                                                    { 
                                                        favorites.some((favorite) => favorite?._id === property?._id)? <PiHeartFill />: <PiHeart />
                                                    }
                                                </div>
                                                <img src={property.propertyImages[0]} alt="image" loading="lazy" className="w-full xl:h-56 xxl:h-62 object-cover rounded-2xl mb-3"/>
                                                <h3 className="font-Plus-Jakarta-Sans font-normal text-2xl text-(--primary-text) capitalize">{ property.name }</h3>
                                                <h4 className="font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize mb-2">{ property.forSale? 'for sale': '' } - { property.forRent? 'for rent': '' }</h4>
                                                <ul className="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
                                                    <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                                                        <PiBed className="text-base sm:text-xl md:text-lg xl:text-xl"/>
                                                        <span className="font-Plus-Jakarta-Sans font-light text-sm xl:text-base"><span className="">{ property.rooms }</span> bed</span>
                                                    </li>
                                                    <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                                                        <PiBathtub className="text-base sm:text-xl md:text-lg xl:text-xl"/>
                                                        <span className="font-Plus-Jakarta-Sans font-light text-sm xl:text-base"><span className="">{ property.bathrooms }</span> bath</span>
                                                    </li>
                                                    <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                                                        <PiGarage className="text-base sm:text-xl md:text-lg xl:text-xl"/>
                                                        <span className="font-Plus-Jakarta-Sans font-light text-sm xl:text-base"><span className="">{ property.garages }</span> garages</span>
                                                    </li>
                                                    <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                                                        <PiRulerDuotone className="text-base sm:text-xl md:text-lg xl:text-xl"/>
                                                        <span className="font-Plus-Jakarta-Sans font-light text-sm xl:text-base"><span className="">{ property.area }</span> sqft</span>
                                                    </li>
                                                </ul>
                                                <p className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) first-letter:capitalize line-clamp-2 mb-4">{ property.description }</p>
                                                <Link to={`/listing/${property._id}`}>
                                                    <button className="w-full py-2 sm:py-2.5 border-2 rounded-3xl font-Playfair text-xl capitalize font-bold bg-(--primary-color) text-(--black-color) border-(--primary-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95 hover:bg-transparent hover:text-(--primary-color)">view more</button>
                                                </Link>
                                            </div>
                                        )
                                    })
                            :
                                <Loader />
                        }
                    </div>
                    <Pagination/>
                </div>
            </section>
            <Footer />
        </main>
    )
}

export default Listings;