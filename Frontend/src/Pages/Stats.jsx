import Header from "../components/Header/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useProps } from "../components/PropsContext";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import Alert from "../components/Alert";
import Modal from "../components/Modal";

function Stats() {

    const { url, user } = useProps();
    const navigate = useNavigate();
    const [ property, setProperty ] = useState(null);
    const [ properties, setProperties ] = useState(null);
    const [ openModal, setOpenModal ] = useState(false);

    useEffect(() => {
        if (user?.role !== 'agent') {
            navigate("/");
        }
    }, [user]);

    useEffect(() => {

        const getOwnProperies = async () => {
            try {
                const res = (await axios.get(
                    `${url}/api/property/get`,
                    {
                        withCredentials: true,
                    }
                )).data;
                setProperties(res.properties);
            } catch (err) {
                console.log(err);
            }
        }
        if (!properties) {
            getOwnProperies();
        }

    }, [])

    const deleteProperty = async () => {
        const currentProperties = [...properties];

        try {
            const res = (await axios.delete(
                `${url}/api/property/delete/${property._id}`,
                {
                    withCredentials: true,
                }
            )).data;
            Alert('success', res.message);
            setProperties(properties.filter((i) => i._id !== property._id));
        } catch (err) {
            console.log(err);
            setProperties(currentProperties);
        } finally {
            setProperty(null);
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
                    <div className="w-full flex flex-col sm:grid sm:grid-cols-12 gap-8 sm:gap-5">
                        {
                            properties?
                                properties.map((property, idx) => {
                                    return (
                                        <div key={idx} className="w-full sm:col-span-6 md:col-span-4 lg:col-span-3 relative">
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
                                                <button onClick={() => { 
                                                    setOpenModal(!openModal) 
                                                    setProperty(property)
                                                    }} className={`${!property.status.includes('pending')? 'hidden': 'block'} font-Plus-Jakarta-Sans text-sm capitalize font-normal text-[#CC4444] cursor-pointer underline`}>
                                                    delete property
                                                </button>
                                                <button className={`${!property.status.includes('pending')? 'hidden': 'block'} font-Plus-Jakarta-Sans text-sm capitalize font-normal text-(--primary-color) cursor-pointer underline`}>
                                                    update
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            :
                                null
                        }
                    </div>
                </div>
            </section>
            <Footer />
            {
                openModal?
                    <Modal>
                        <div className="w-full sm:w-140 rounded-3xl bg-(--bg-color) p-6">
                            <div className="flex flex-col justify-center gap-2 mb-8">
                                <h2 className="font-Playfair font-medium text-3xl text-(--primary-text) capitalize">Confirm Deletion</h2>
                                <h3 className="font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) first-letter:capitalize">
                                    This 
                                    <Link to={`/listing/${property._id}`}>
                                        <span className="text-(--primary-color) text-base hover:underline cursor-pointer"> { property.name } </span> 
                                    </Link>
                                    property will be permanently deleted. Do you wish to proceed?
                                </h3>
                            </div>
                            <div className="flex items-center justify-end gap-3">
                                <button onClick={() => {
                                    deleteProperty();
                                    setOpenModal(!openModal);
                                    }} className="py-2 px-8 border rounded-2xl font-Playfair text-base capitalize font-semibold text-[#CC4444] border-[#CC4444] cursor-pointer transition duration-300 ease-in-out hover:scale-95 hover:bg-[#CC4444] hover:text-(--primary-text)">delete</button>
                                <button onClick={() => setOpenModal(!openModal)} className="py-2 px-8 border rounded-2xl font-Playfair text-base capitalize font-semibold bg-transparent text-(--primary-color) border-(--primary-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95 hover:bg-(--primary-color) hover:text-(--primary-text)">cancel</button>
                            </div>
                        </div>
                    </Modal>
                :
                    null
            }
        </main>
    )
}

export default Stats