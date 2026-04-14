import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
// Components
import { useProps } from "../components/PropsProvider";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

function Stats() {

    const { 
        user,
        isLoading,
        setIsLoading
    } 
    = useProps();

    const navigate = useNavigate();
    const [ listingId, setListingId ] = useState(null);
    const [ properties, setProperties ] = useState([]);
    const [ openModal, setOpenModal ] = useState(false);

    useEffect(() => {
        if (user.role !== 'agent') {
            navigate("/");
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        const getOwnProperies = async () => {
            try {
                const { data } = await api.get(
                    `/api/property/get`,
                );
                if (data.properties.length > 0) setProperties(data.properties);
            } catch (err) {
                Alert('error', err.response?.data?.message);
            }
        }
        getOwnProperies();
    }, [])

    
    const onConfirm = async () => {
        const currentProperties = [...properties];

        try {
            setIsLoading(true);
            const { data: { message } } = await api.delete(
                `/api/property/${listingId}/delete`,
            );

            Alert('success', message);
            setProperties(properties.filter((i) => i._id !== listingId));
        } catch (err) {
            if (err.response) {
                Alert('error', err.response.data.message);
            } else {
                Alert('error', err.message);
            }
            setProperties(currentProperties);
        } finally {
            setOpenModal(!openModal);
            setListingId(null);
            setIsLoading(false);
        }
    }


    return (
        <main>
            <Header />
            <section className="pb-25 mt-26 lg:mt-36">
                <div className="container mx-auto px-4 md:px-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-5 border-b border-(--secondary-text) gap-4 sm:gap-0">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-Playfair font-medium text-4xl text-(--primary-text) capitalize">properties stats</h2>
                            <h4 className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">Understand your properties' key metrics.</h4>
                        </div>
                    </div>
                    <div className={`${!isLoading? 'h-full': 'h-[50vh]'} relative w-full flex flex-col sm:grid sm:grid-cols-12 gap-8 sm:gap-5`}>
                        {
                            !isLoading?
                                properties.length?
                                    properties.map((property, idx) => {
                                        return (
                                            <div key={idx} className="w-full sm:col-span-6 md:col-span-4 lg:col-span-3 relative" data-listing-id={property._id}>
                                                <img src={property.images[0]} alt="property image" className="w-full h-52 sm:h-46 object-cover rounded-2xl mb-2"/>
                                                <div className="absolute top-3 left-3 py-2 px-4 rounded-2xl bg-(--secondary-color)">
                                                    <span className="font-Plus-Jakarta-Sans font-medium text-sm text-(--primary-text)">{ property.price }$</span>
                                                </div>
                                                <h3 className="font-Plus-Jakarta-Sans font-medium text-xl text-(--primary-text) capitalize mb-3">{ property.name }</h3>
                                                <ul className="flex flex-col gap-1 mb-3">
                                                    <li className="w-full flex items-center justify-between">
                                                        <h4 className="font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">uploadedAt:</h4>
                                                        <h5 className="font-Plus-Jakarta-Sans font-normal text-sm text-(--primary-text) capitalize">{ property.createdAt.split('T')[0] }</h5>
                                                    </li>
                                                    <li className="w-full flex items-center justify-between">
                                                        <h4 className="font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">views:</h4>
                                                        <h5 className="font-Plus-Jakarta-Sans font-normal text-sm text-(--primary-text) capitalize">{ 0 }</h5>
                                                    </li>
                                                    <li className="w-full flex items-center justify-between">
                                                        <h4 className="font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">scheduled visitings:</h4>
                                                        <h5 className="font-Plus-Jakarta-Sans font-normal text-sm text-(--primary-text) capitalize">{ property.pendingBookings }</h5>
                                                    </li>
                                                    <li className="w-full flex items-center justify-between">
                                                        <h4 className="font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">done visitings:</h4>
                                                        <h5 className="font-Plus-Jakarta-Sans font-normal text-sm text-(--primary-text) capitalize">{ property.visitedBookings }</h5>
                                                    </li>
                                                    <li className="w-full flex items-center justify-between">
                                                        <h4 className="font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">status:</h4>
                                                        <h5 className={`${property.status.includes('pending')? 'border-[#FFC400] bg-[rgb(255,196,0,0.1)]': property.status.includes('accepted')? 'border-[#57D9A3] bg-[rgb(87,217,163,0.1)]' : 'border-[#2684FF] bg-[rgb(38,132,255,0.1)]'} font-Plus-Jakarta-Sans font-normal text-(--primary-text) text-xs capitalize border py-2 px-4 rounded-xl`}>{ property.status }</h5>
                                                    </li>
                                                </ul>
                                                <div className="w-full flex items-center justify-between">
                                                    <button onClick={() => { setListingId(property._id); setOpenModal(!openModal) }} className={`${!property.status.includes('pending')? 'hidden': 'block'} font-Plus-Jakarta-Sans text-sm capitalize font-normal text-[#CC4444] cursor-pointer underline`}>
                                                        delete
                                                    </button>
                                                    <button className={`${!property.status.includes('pending')? 'hidden': 'block'} font-Plus-Jakarta-Sans text-sm capitalize font-normal text-(--primary-color) cursor-pointer underline`}>
                                                        update
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                :
                                    <div className="col-span-12 h-[50vh] flex items-center justify-center">
                                        <h1 className="col-span-12 font-Plus-Jakarta-Sans font-medium text-xl text-(--primary-text) text-center capitalize">Not properties found</h1>
                                    </div>
                            :
                                <Loader/>
                        }
                    </div>
                </div>
            </section>
            <Footer />
            { openModal && <DeleteConfirmModal 
                    text={`This property will be permanently deleted. Do you wish to proceed?`}
                    onConfirm={onConfirm} 
                    onClose={() => setOpenModal(!openModal)}
                /> 
            }
        </main>
    )
}

export default Stats;