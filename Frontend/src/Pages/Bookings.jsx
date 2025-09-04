import { useCallback, useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer";
import { useProps } from "../components/PropsContext";
import axios from "axios";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";

function Bookings() {

    const { url } = useProps();
    const [ bookings, setBookings ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ filter, setFilter ] = useState({ sort: '', status: '' })

    useEffect(() => {
        const getBookigns = async () => {
            setIsLoading(true);
            try {
                const res = (await axios.get(
                    `${url}/api/booking/receive?sort=${filter.sort}&status=${filter.status}`,
                    {
                        withCredentials: true
                    }
                )).data;
                setBookings(res.bookings);
            } catch(err) {
                console.log(err);
            }
            setIsLoading(false);
        }
        getBookigns();

    }, [filter]);

    const filterUpdating = useCallback((event) => {
        setFilter((prevs) => {
            return { ...prevs, [event.target.name]: event.target.value }
        })
    }, [])

    const bookingUpdating = useCallback(async (event, bookingId, status) => {
        console.log(event);
        try {
            const res = (await axios.post(
                `${url}/api/booking/update/${bookingId}`,
                {
                    status: status
                },
                {
                    withCredentials: true
                }
            )).data;
            
            Alert('success', res.message);

            if (status.includes('rejected')) {
                setBookings(bookings.filter((booking) => {
                    return booking._id !== res.deletedBooking._id
                }));
            } else {
                setBookings((bookings) => {
                    return bookings.map((booking) => {
                        if (booking._id === res.updatedBooking._id) {
                            return { ...booking, status: res.updatedBooking.status }
                        } else {
                            return booking;
                        }
                    });
                });
            }

        } catch(err) {
            console.log(err);
            Alert('error', err.response?.data?.message);
        }
    }, [])


    return (
        <main>
            <Header />
            <section className="pb-25 mt-26 lg:mt-36">
                <div className="container mx-auto">
                    <div className="flex flex-col gap-1 pb-3 mb-5 border-b border-(--secondary-text)">
                        <h2 className="font-Playfair font-medium text-4xl text-(--primary-text) capitalize">bookings invitations</h2>
                        <h4 className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">Understand and manage your properties' booking invitations</h4>
                    </div>
                    <div className="w-full grid grid-cols-12 gap-5">
                        <div className="col-span-12 md:col-span-4 order-1">
                            <div className="w-full border border-(--secondary-text) rounded-3xl p-6">
                                <h3 className="font-Playfair font-medium text-2xl text-(--primary-text) capitalize pb-3 border-b border-(--secondary-text) mb-5">filtering</h3>
                                <ul className="flex flex-col gap-3">
                                    <li className="flex items-center justify-between">
                                        <label htmlFor='status' className="font-Plus-Jakarta-Sans font-normal text-base text-(--primary-text) capitalize">all <span className="text-sm text-(--secondary-text)">( { bookings.length } )</span></label>
                                        <input onChange={filterUpdating} type="radio" id='status' name='status' value='' className="relative appearance-none w-6 h-6 border-2 border-(--secondary-text) bg-[rgb(185,187,189,.10)] rounded-md checked:border-(--primary-color) before:absolute checked:before:content-['\2713'] before:text-(--primary-color) before:top-2/4 before:left-2/4 before:-translate-2/4"/>
                                    </li>
                                    <li className="flex flex-col gap-2">
                                        <h5 className="font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize mb-2 pb-1 border-b border-(--secondary-text)">order</h5>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor='sort' className="font-Plus-Jakarta-Sans font-normal text-base text-(--primary-text) capitalize">latest</label>
                                            <input onChange={filterUpdating} type="radio" id='sort' name='sort' value='latest' className="relative appearance-none w-6 h-6 border-2 border-(--secondary-text) bg-[rgb(185,187,189,.10)] rounded-md checked:border-(--primary-color) before:absolute checked:before:content-['\2713'] before:text-(--primary-color) before:top-2/4 before:left-2/4 before:-translate-2/4"/>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor='sort' className="font-Plus-Jakarta-Sans font-normal text-base text-(--primary-text) capitalize">oldest</label>
                                            <input onChange={filterUpdating} type="radio" id='sort' name='sort' value='oldest' className="relative appearance-none w-6 h-6 border-2 border-(--secondary-text) bg-[rgb(185,187,189,.10)] rounded-md checked:border-(--primary-color) before:absolute checked:before:content-['\2713'] before:text-(--primary-color) before:top-2/4 before:left-2/4 before:-translate-2/4"/>
                                        </div>
                                    </li>
                                    <li className="flex flex-col gap-2">
                                        <h5 className="font-Plus-Jakarta-Sans font-light text-base text-(--secondary-text) capitalize mb-2 pb-1 border-b border-(--secondary-text)">status</h5>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor='status' className="font-Plus-Jakarta-Sans font-normal text-base text-(--primary-text) capitalize">pending</label>
                                            <input onChange={filterUpdating} type="radio" id='status' name='status' value='pending' className="relative appearance-none w-6 h-6 border-2 border-(--secondary-text) bg-[rgb(185,187,189,.10)] rounded-md checked:border-(--primary-color) before:absolute checked:before:content-['\2713'] before:text-(--primary-color) before:top-2/4 before:left-2/4 before:-translate-2/4"/>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor='status' className="font-Plus-Jakarta-Sans font-normal text-base text-(--primary-text) capitalize">accepted</label>
                                            <input onChange={filterUpdating} type="radio" id='status' name='status' value='accepted' className="relative appearance-none w-6 h-6 border-2 border-(--secondary-text) bg-[rgb(185,187,189,.10)] rounded-md checked:border-(--primary-color) before:absolute checked:before:content-['\2713'] before:text-(--primary-color) before:top-2/4 before:left-2/4 before:-translate-2/4"/>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor='status' className="font-Plus-Jakarta-Sans font-normal text-base text-(--primary-text) capitalize">visited</label>
                                            <input onChange={filterUpdating} type="radio" id='status' name='status' value='visited' className="relative appearance-none w-6 h-6 border-2 border-(--secondary-text) bg-[rgb(185,187,189,.10)] rounded-md checked:border-(--primary-color) before:absolute checked:before:content-['\2713'] before:text-(--primary-color) before:top-2/4 before:left-2/4 before:-translate-2/4"/>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-8 relative grid grid-cols-12 gap-4 border border-(--secondary-text) rounded-3xl p-4 sm:p-6 overflow-hidden order-2">
                            {
                                !isLoading?
                                    bookings.length > 0?
                                        bookings.map((booking, idx) => {
                                            return (
                                                <div key={idx} className="col-span-12 relative h-fit rounded-3xl bg-(--bg-color) outline outline-offset-1 outline-white/30 p-4">
                                                    <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 sm:gap-0 pb-2 border-b border-(--secondary-text)">
                                                        <div className="flex items-center gap-3">
                                                            <img src={booking.user.picture} alt="picture" className="w-14 h-14 rounded-full border border-(--primary-color)" />
                                                            <div className="flex flex-col gap-0">
                                                                <h3 className="font-Plus-Jakarta-Sans font-medium text-base text-(--primary-text) capitalize">{ booking.user.name }</h3>
                                                                <h4 className="font-Plus-Jakarta-Sans font-normal text-sm text-(--secondary-text) capitalize line-clamp-1">{ booking.user.jobTitle }</h4>
                                                            </div>
                                                        </div>
                                                        <Link to={`/listing/${booking.property._id}`}>
                                                            <h4 className="font-Plus-Jakarta-Sans font-normal text-sm text-(--primary-color) underline cursor-pointer capitalize duration-300 hover:scale-95">view property</h4>
                                                        </Link>
                                                    </div>
                                                    <h3 className="font-Plus-Jakarta-Sans font-medium text-xl text-(--primary-text) capitalize mb-3">{ }</h3>
                                                    <ul className="flex flex-col gap-2 mb-5">
                                                        <li className="flex items-center gap-2">
                                                                <h4 className="w-1/4 font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">email:</h4>
                                                                <h5 className="font-Plus-Jakarta-Sans font-light text-base text-(--primary-text) overflow-x-scroll scrollbar-none">{ booking.email }</h5>
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                                <h4 className="w-1/4 font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">time:</h4>
                                                                <h5 className="font-Plus-Jakarta-Sans font-light text-base text-(--primary-text)">{ booking.time }</h5>
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                                <h4 className="w-1/4 font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">phone:</h4>
                                                                <h5 className="font-Plus-Jakarta-Sans font-light text-base text-(--primary-text)">{ booking.phone }</h5>
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                                <h4 className="w-1/4 font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">purpose:</h4>
                                                                <h5 className="font-Plus-Jakarta-Sans font-light text-base text-(--primary-text) capitalize">{ booking.purpose }</h5>
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                                <h4 className="w-1/4 font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">status:</h4>
                                                                <h5 className={`${booking.status.includes('pending')? 'text-[#FFC400]': booking.status.includes('accepted')? 'text-[#57D9A3]' : 'text-[#2684FF]'} font-Plus-Jakarta-Sans font-light text-base text-(--primary-text) capitalize`}>{ booking.status }</h5>
                                                        </li>
                                                    </ul>
                                                    <div className={`${['visited', 'rejected'].includes(booking.status) ? 'hidden' : 'flex'} items-center justify-end gap-3`}>
                                                        <button onClick={(event) => bookingUpdating(event, booking._id, 'accepted')} className={`${booking.status.includes('accepted')? 'hidden' : 'block'} w-full py-2 px-8 border rounded-2xl font-Playfair text-base capitalize font-semibold hover:bg-(--primary-color) hover:text-(--black-color) border-(--primary-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95 bg-transparent text-(--primary-color)`}>accept</button>
                                                        <button onClick={(event) => bookingUpdating(event, booking._id, 'visited')} className={`${booking.status.includes('pending')? 'hidden' : 'block'} w-full py-2 px-8 border rounded-2xl font-Playfair text-base capitalize font-semibold hover:bg-(--primary-color) hover:text-(--black-color) border-(--primary-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95 bg-transparent text-(--primary-color)`}>done</button>
                                                        <button onClick={(event) => bookingUpdating(event, booking._id, 'rejected')} className={`${booking.status.includes('accepted')? 'hidden' : 'block'} w-full py-2 px-8 border rounded-2xl font-Playfair text-base capitalize font-semibold text-[#CC4444] border-[#CC4444] cursor-pointer transition duration-300 ease-in-out hover:scale-95 hover:bg-[#CC4444] hover:text-(--primary-text)`}>reject</button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    :
                                        <div className="col-span-12 h-[50vh] flex items-center justify-center">
                                            <h1 className="col-span-12 font-Plus-Jakarta-Sans font-normal text-lg text-(--secondary-text) text-center capitalize">No bookings found</h1>
                                        </div>
                                :
                                    <Loader />
                            }
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    )
}

export default Bookings;