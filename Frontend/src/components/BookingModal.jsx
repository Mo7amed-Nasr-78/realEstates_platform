import { useState } from "react";
import { useProps } from "./PropsProvider";
import { purposeList, timesList } from "../../Data/Data";
import {
    PiCaretDown,
    PiCalendarLight,
} from "react-icons/pi";
// Components
import Alert from "./Alert";
import Dropdown from "./Dropdown";
import Modal from "./Modal";
import Calendar from "./Calendar";

function BookingModal({ onClose, onConfirm }) {

    const bookingObj = {
        name: '',
        email: '',
        phone: '',
        purpose: '',
        time: '',
        date: '',
    }

    const { isLoading } = useProps();
    const [ booking, setBooking ] = useState(bookingObj);
    const [ openCalendar, setOpenCalendar ] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, phone, date, purpose, time } = booking;
        if (!name || !email || !phone || !date || !purpose || !time) {
            Alert("warning", "Please enter your booking data first");
            return;
        }

        onConfirm?.(booking);
    }

    return (
        <Modal>
            <div className="modal w-full md:w-160 xl:w-200 border border-(--secondary-text)/25 rounded-3xl bg-(--bg-color) p-6">
                <div className="flex flex-col gap-1 mb-6 sm:mb-8">
                    <h2 className="font-Playfair font-medium text-3xl sm:text-4xl text-(--primary-text) capitalize mb-1">veiwing book</h2>
                    <h3 className="font-Plus-Jakarta-Sans font-light text-base sm:text-lg text-(--secondary-text) first-letter:capitalize">Property Viewing Booking Details with User and Property Info</h3>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-12 gap-3 mb-5">
                        <div className={`col-span-12 sm:col-span-6 flex flex-col gap-1`}>
                            <label htmlFor={"name"} className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">full name:</label>
                            <input type="text" onChange={(event) => { setBooking({ ...booking, [event.target.name]: event.target.value }) }} value={booking.name} name={"name"} id={"name"} autoComplete="off" placeholder={'Enter Your Name'} className="w-full h-12 border-b border-(--secondary-text) px-3 text-base text-(--primary-text) placeholder:text-base placeholder:text-(--secondary-text)/50 placeholder:font-extralight focus:outline-none"/>
                        </div>
                        <div className={`col-span-12 sm:col-span-6 flex flex-col gap-1`}>
                            <label htmlFor={"email"} className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">email:</label>
                            <input type="email" onChange={(event) => { setBooking({ ...booking, [event.target.name]: event.target.value }) }} value={booking.email} name="email" id="email" autoComplete="off" placeholder={'Enter Your Email'} className="w-full h-12 border-b border-(--secondary-text) px-3 text-base text-(--primary-text) placeholder:text-base placeholder:text-(--secondary-text)/50 placeholder:font-extralight focus:outline-none"/>
                        </div>
                        <div className={`col-span-12 sm:col-span-6 flex flex-col gap-1`}>
                            <label htmlFor={"phone"} className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">phone:</label>
                            <input type="text" onChange={(event) => { setBooking({ ...booking, [event.target.name]: event.target.value }) }} value={booking.phone} name="phone" id="phone" autoComplete="off" placeholder={'Enter Your Phone'} className="w-full h-12 border-b border-(--secondary-text) px-3 text-base text-(--primary-text) placeholder:text-base placeholder:text-(--secondary-text)/50 placeholder:font-extralight focus:outline-none"/>
                        </div>
                        <div className="col-span-12 sm:col-span-6 flex flex-col gap-1">
                            <label htmlFor="purpose" className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">purpose:</label>
                            <Dropdown
                                items={purposeList}
                                classes={'w-4/5 bottom-full'}
                                onSelect={(value) => { setBooking({ ...booking, ["purpose"]: value }) }}
                            >
                                <div className="w-full h-12 flex items-center justify-between border-b border-(--secondary-text) px-3">
                                    <span className={`${booking.purpose? 'text-(--primary-text)': `text-(--secondary-text)/50 font-extralight`} text-base capitalize`}>{ !booking.purpose? `Enter Your Date`: booking.purpose }</span>
                                    <PiCaretDown className="text-2xl text-(--primary-text)"/>
                                </div>
                            </Dropdown>
                        </div>
                        <div className="col-span-12 sm:col-span-6 flex flex-col gap-1">
                            <label htmlFor="time" className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">time:</label>
                            <Dropdown
                                items={timesList}
                                classes={'w-4/5 bottom-full'}
                                onSelect={(value) => { setBooking({ ...booking, ["time"]: value }) }}
                            >
                                <div className="w-full h-12 flex items-center justify-between border-b border-(--secondary-text) px-3">
                                    <span className={`${booking.time? 'text-(--primary-text)': `text-(--secondary-text)/50 font-extralight`} text-base capitalize`}>{ !booking.time? `Enter Your Fit Time`: booking.time }</span>
                                    <PiCaretDown className="text-2xl text-(--primary-text)"/>
                                </div>
                            </Dropdown>
                        </div>
                        <div className={`col-span-12 sm:col-span-6 flex flex-col gap-1`}>
                            <label htmlFor="date" className="font-Plus-Jakarta-Sans font-light text-lg text-(--secondary-text) capitalize">date:</label>
                            <div className="relative flex items-center justify-center border-b border-(--secondary-text) px-3">
                                { openCalendar? <Calendar onApply={(value) => setBooking({ ...booking, ["date"]: value })} onCancel={() => setOpenCalendar(!openCalendar) }/> : null }
                                <span className={`${ booking.date? 'text-(--primary-text)' : 'text-(--secondary-text)/50 font-extralight'} w-full h-12 flex items-center text-base`}>{ !booking.date? `DD/MM/YY`: booking.date }</span>
                                <PiCalendarLight onClick={() => setOpenCalendar(!openCalendar)} className="text-2xl text-(--primary-text) hover:text-(--primary-color) cursor-pointer" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <button onClick={onClose} className="h-10 w-26 border rounded-2xl font-Playfair text-base capitalize font-semibold text-[#CC4444] border-[#CC4444] cursor-pointer transition duration-300 ease-in-out hover:scale-95 hover:bg-[#CC4444] hover:text-(--primary-text)">cancel</button>
                        <button disabled={isLoading} className="h-10 w-26 border rounded-2xl font-Playfair text-base capitalize font-semibold bg-(--primary-color) text-(--black-color) border-(--primary-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95 hover:bg-transparent hover:text-(--primary-color)">
                            <div className={`${isLoading? 'block': 'hidden'} mx-auto relative h-5 w-5 animate-spin`}>
                                <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-(--red-color) border-t-transparent"></div>
                            </div>
                            <span className={`${isLoading? 'hidden' : 'block'}`}>booking</span>
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default BookingModal;