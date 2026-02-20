import { useEffect, useState } from "react";
import { useProps } from "../components/PropsProvider";
import axios from 'axios';
import { 
    PiFunnel,
    PiMagnifyingGlass,
    PiCaretDown,
} from 'react-icons/pi';
// Components
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Pagination from "../components/Paginations";
import Dropdown from "../components/Dropdown";
import { priceRange, propertyCategories, roomsAndBathrooms } from "../../Data/Data";
import ListingCard from "../components/ListingCard";

function Listings() {

    const { 
        isLoading,
        setIsLoading,
    } 
    = useProps();
    const [ page, setPage ] = useState(1);
    const [ listings, setListings ] = useState([]);
    const [ showFilter, setShowFilter ] = useState(false);
    const [ filter, setFilter ] = useState({ query: '', min: '', max: '', type: '', rooms: '', bathrooms: '' });

    useEffect(() => {
        const getListings = async () => {
            setIsLoading(true);
            try {
                const { data: { properties } } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/property/getAll?q=${filter.query}&minPrice=${filter.min}&maxPrice=${filter.max}&category=${filter.type}&rooms=${filter.rooms}&bathrooms=${filter.bathrooms}`, 
                    { 
                        params: {
                            page,
                        },
                    }
                )
                setListings(properties);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
        getListings();
    }, [page, filter]);

    const updateFilter = (field, value) => {
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

    }

    return (
        <main>
            <Header />
            <section className="w-full mt-26 lg:mt-36 mb-25">
                <div className="container mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-0 mb-5">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-Playfair font-medium text-4xl text-(--primary-text) capitalize">our all residences</h2>
                            <h4 className="font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) capitalize">{ listings.length } results of residences</h4>
                        </div>
                        <button onClick={() => { showFilter? setShowFilter(false): setShowFilter(true) }} className="w-fit flex items-center gap-1 text-(--secondary-text) px-5 py-2.5 sm:py-3 border border-(--secondary-text) duration-300 ease-in-out hover:text-(--primary-color) hover:border-(--primary-color) hover:scale-95 cursor-pointer rounded-[20px]">
                            <PiFunnel className="text-xl sm:text-2xl"/>
                            <span className="font-Playfair font-normal text-lg capitalize">filter</span>
                        </button>
                    </div>
                    <div className={`${showFilter? 'block': 'hidden'} w-full flex flex-wrap xl:flex-nowrap items-center gap-4 sm:gap-3 bg-[rgb(204,204,204,0.08)] rounded-3xl mb-5 p-3`}>
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
                                listings.length?
                                    listings.map((listing, idx) => {
                                        return <ListingCard key={idx} listing={listing} />
                                    })
                                :
                                    <div className="col-span-12 h-[50vh] flex items-center justify-center">
                                        <h1 className="col-span-12 font-Plus-Jakarta-Sans font-medium text-xl text-(--primary-text) text-center capitalize">Not Properties found</h1>
                                    </div>
                            :
                                <Loader />
                        }
                    </div>
                    <Pagination setPage={(num) => setPage(num)}/>
                </div>
            </section>
            <Footer />
        </main>
    )
}

export default Listings;