import { Link } from "react-router-dom"
import { useProps } from "./PropsProvider";
import {
    PiBed,
    PiBathtub,
    PiGarage,
    PiRulerDuotone,
    PiHeart,
    PiHeartFill,
} from 'react-icons/pi';

function ListingCard({ listing: { 
    _id, 
    name,
    rooms,
    bathrooms,
    garages,
    area,
    description,
    forSale,
    forRent,
    propertyImages
} }) {

    const { 
        favorites,
        addFavorite,
        removeFavorite
    } = useProps();

    return (
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 relative w-full h-full bg-(--secondary-color) p-3 md:p-4 rounded-3xl sm:rounded-4xl duration-300 ease-in-out hover:scale-[99%]" data-propertyid={_id}>
            <h4 className="absolute top-5 left-5 sm:top-8 sm:left-8 font-Plus-Jakarta-Sans font-medium text-base text-(--primary-text) bg-(--secondary-color) py-2 px-4 rounded-2xl">{ forSale }$</h4>
            {
                favorites?.some((i) => i.property === _id)?
                    <div onClick={() => removeFavorite(_id)} className="absolute right-5 top-5 sm:right-8 sm:top-8 w-10 h-10 flex items-center justify-center rounded-full bg-(--secondary-color) text-2xl text-(--primary-text) cursor-pointer duration-300 ease-in-out hover:scale-95">
                        <PiHeartFill />
                    </div>
                :
                    <div onClick={() => addFavorite(_id)} className="absolute right-5 top-5 sm:right-8 sm:top-8 w-10 h-10 flex items-center justify-center rounded-full bg-(--secondary-color) text-2xl text-(--primary-text) cursor-pointer duration-300 ease-in-out hover:scale-95">
                        <PiHeart />
                    </div>
            }
            <img src={propertyImages[0]} alt="image" loading="lazy" className="w-full xl:h-56 xxl:h-62 object-cover rounded-2xl mb-3"/>
            <h3 className="font-Plus-Jakarta-Sans font-normal text-2xl text-(--primary-text) capitalize">{ name }</h3>
            <h4 className="font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize mb-2">{ forSale? 'for sale': '' } - { forRent? 'for rent': '' }</h4>
            <ul className="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
                <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                    <PiBed className="text-base sm:text-xl md:text-lg xl:text-xl"/>
                    <span className="font-Plus-Jakarta-Sans font-light text-sm xl:text-base"><span className="">{ rooms }</span> bed</span>
                </li>
                <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                    <PiBathtub className="text-base sm:text-xl md:text-lg xl:text-xl"/>
                    <span className="font-Plus-Jakarta-Sans font-light text-sm xl:text-base"><span className="">{ bathrooms }</span> bath</span>
                </li>
                <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                    <PiGarage className="text-base sm:text-xl md:text-lg xl:text-xl"/>
                    <span className="font-Plus-Jakarta-Sans font-light text-sm xl:text-base"><span className="">{ garages }</span> garages</span>
                </li>
                <li className="flex items-center gap-1 text-(--secondary-text) capitalize">
                    <PiRulerDuotone className="text-base sm:text-xl md:text-lg xl:text-xl"/>
                    <span className="font-Plus-Jakarta-Sans font-light text-sm xl:text-base"><span className="">{ area }</span> sqft</span>
                </li>
            </ul>
            <p className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) first-letter:capitalize line-clamp-2 mb-4">{ description }</p>
            <Link to={`/listing/${_id}`}>
                <button className="w-full py-2 sm:py-2.5 border-2 rounded-3xl font-Playfair text-xl capitalize font-bold bg-(--primary-color) text-(--black-color) border-(--primary-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95 hover:bg-transparent hover:text-(--primary-color)">view more</button>
            </Link>
        </div>
    )
}

export default ListingCard;