import { useState } from "react";
import { useProps } from "../components/PropsProvider";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Pagination from "../components/Paginations";
import { 
    PiBed,
    PiBathtub,
    PiGarage,
    PiRulerDuotone,
    PiHeartFill,
} from 'react-icons/pi';
import Loader from "../components/Loader";
import { useEffect } from "react";
import Alert from "../components/Alert";
import api from "../../utils/axiosInstance";

function Favorites() {

    const { 
        favorites,
        isLoading,
        removeFavorite,
    } 
    = useProps();

    const [ Listings, setListings ] = useState([]);
    const [ page, setPage ] = useState(1);

    useEffect(() => {
        if (!page) return;

        const getFavorites = async () => {
            try {
                const { data: { favorites } } = await api.get(
                    `/api/favorite/getAll`,
                    {
                        params: {
                            page
                        }
                    }
                )

                setListings(favorites);
            } catch (err) {
                if (err.response) {
                    Alert("error", err.response.data.message);
                } else {
                    Alert("error", err.message);
                }
            }
        }
        getFavorites();

    }, [page, favorites]);

    return (
        <main>
            <Header />
            <section className="w-full mt-26 lg:mt-36 mb-25">
                <div className="container mx-auto">
                    <div className="flex items-end justify-between mb-5">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-Playfair font-medium text-4xl text-(--primary-text) capitalize">Favorites Ones</h2>
                            <h4 className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">{ favorites?.length } results of residences</h4>
                        </div>
                    </div>
                    <div className="relative grid grid-cols-12 gap-5">
                        {
                            !isLoading?
                                Listings.length?
                                    Listings.map((favorite, index) => {
                                        return (
                                            <div key={index} className="col-span-12 sm:col-span-6 lg:col-span-4 relative w-full h-full bg-(--secondary-color) p-3 md:p-4 rounded-3xl sm:rounded-4xl duration-300 ease-in-out hover:scale-[99%]" data-propertyid={favorite?._id}>
                                                <h4 className="absolute top-5 left-5 sm:top-8 sm:left-8 font-Plus-Jakarta-Sans font-medium text-base text-(--primary-text) bg-(--secondary-color) py-2 px-4 rounded-2xl">{ favorite.forSale }$</h4>
                                                    <div onClick={() => removeFavorite(favorite)} className="absolute right-5 top-5 sm:right-8 sm:top-8 w-10 h-10 flex items-center justify-center rounded-full bg-(--secondary-color) text-2xl text-(--primary-text) cursor-pointer duration-300 ease-in-out hover:scale-95">
                                                        <PiHeartFill />
                                                    </div>
                                                <img src={favorite.propertyImages[0]} alt="image" className="w-full xl:h-56 xxl:h-62 object-cover rounded-2xl mb-3"/>
                                                <h3 className="font-Plus-Jakarta-Sans font-normal text-2xl text-(--primary-text) capitalize">{ favorite.name }</h3>
                                                <h4 className="font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize mb-2">{ favorite.forSale? 'for sale': '' } - { favorite.forRent? 'for rent': '' }</h4>
                                                <ul className="w-full flex flex-wrap items-center justify-between gap-2 mb-5">
                                                    <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                                                        <PiBed className="text-base sm:text-xl md:text-lg xl:text-xl"/>
                                                        <span className="font-Plus-Jakarta-Sans font-light text-sm xl:text-base"><span className="">{ favorite.rooms }</span> bed</span>
                                                    </li>
                                                    <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                                                        <PiBathtub className="text-base sm:text-xl md:text-lg xl:text-xl"/>
                                                        <span className="font-Plus-Jakarta-Sans font-light text-sm xl:text-base"><span className="">{ favorite.bathrooms }</span> bath</span>
                                                    </li>
                                                    <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                                                        <PiGarage className="text-base sm:text-xl md:text-lg xl:text-xl"/>
                                                        <span className="font-Plus-Jakarta-Sans font-light text-sm xl:text-base"><span className="">{ favorite.garages }</span> garages</span>
                                                    </li>
                                                    <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                                                        <PiRulerDuotone className="text-base sm:text-xl md:text-lg xl:text-xl"/>
                                                        <span className="font-Plus-Jakarta-Sans font-light text-sm xl:text-base"><span className="">{ favorite.area }</span> sqft</span>
                                                    </li>
                                                </ul>
                                                <Link to={`/listing/${favorite._id}`}>
                                                    <button className="w-full py-2 sm:py-2.5 border-2 rounded-3xl font-Playfair text-xl capitalize font-bold bg-(--primary-color) text-(--black-color) border-(--primary-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95 hover:bg-transparent hover:text-(--primary-color)">view more</button>
                                                </Link>
                                            </div>
                                        )
                                    })
                                :
                                    <div className="col-span-12 h-[50vh] flex flex-col items-center justify-center py-4">
                                        <h3 className="font-Plus-Jakarta-Sans font-medium text-(--secondary-text) text-lg capitalize">no favorites found</h3>
                                    </div>
                            : 
                                <Loader />
                        }
                    </div>
                    <Pagination setPage={setPage}/>
                </div>
            </section>
            <Footer />
        </main>
    )
}

export default Favorites;