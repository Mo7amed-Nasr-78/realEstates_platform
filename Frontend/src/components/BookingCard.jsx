import { Link } from "react-router-dom";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useState } from "react";
import api from "../../utils/axiosInstance";
import Alert from "./Alert";

function BookingCard({ booking, onDelete }) {
    const [ openDeleteModal, setOpenDeleteModal ] = useState(false);

    const onConfirm = async () => {
        try {
            const { data: { message } } = await api.delete(
                `/api/booking/${booking._id}/delete`,
            );
            onDelete?.(booking._id)
            Alert('success', message);
        } catch (err) {
            if (err.response) {
                Alert(err.response?.data?.message);
            } else {
                Alert(err.message);
            }
        } finally {
            setOpenDeleteModal(false);
        }
    }

    const onClose = () => {
        setOpenDeleteModal(!openDeleteModal);
    }

    return (
        <>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <img src={booking.property.propertyImages[0]} alt="property image" className="w-full h-42 object-cover rounded-2xl mb-1" />
                <div className="w-full flex items-center justify-between mb-2">
                    <h5 className="w-full font-Plus-Jakarta-Sans font-normal text-lg text-(--primary-text) line-clamp-1 capitalize">{ booking.property.name }</h5>
                    <Link to={`/profile/${booking.agent._id}`}>
                        <span className="font-Plus-Jakarta-Sans font-normal text-sm text-(--primary-color) underline capitalize">agency</span>
                    </Link>
                </div>
                <ul className="w-full flex flex-col gap-1 mb-3">
                    <li className="flex items-center justify-between">
                        <h4 className="font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">agent:</h4>
                        <h5 className="font-Plus-Jakarta-Sans font-normal text-sm text-(--primary-text) capitalize">{ booking.agent.name }</h5>
                    </li>
                    <li className="flex items-center justify-between">
                        <h4 className="font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">date:</h4>
                        <h5 className="font-Plus-Jakarta-Sans font-normal text-sm text-(--primary-text) capitalize">{ booking.date }</h5>
                    </li>
                    <li className="flex items-center justify-between">
                        <h4 className="font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">time:</h4>
                        <h5 className="font-Plus-Jakarta-Sans font-normal text-sm text-(--primary-text) capitalize">{ booking.time }</h5>
                    </li>
                    <li className="flex items-center justify-between">
                        <h4 className="font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">status:</h4>
                        <h5 className={`${booking.status.includes('pending')? 'text-[#FFC400]': booking.status.includes('accepted')? 'text-[#57D9A3]' : 'text-[#2684FF]'} font-Plus-Jakarta-Sans font-normal text-sm capitalize`}>{ booking.status }</h5>
                    </li>
                </ul>

                <button
                    onClick={onClose}
                    className={`${!booking.status.includes('pending')? 'hidden': 'block'} h-9 w-full font-Plus-Jakarta-Sans text-sm rounded-xl capitalize font-normal text-[#CC4444] border border-[#CC4444] cursor-pointer duration-300 hover:text-(--primary-text) hover:bg-[#CC4444]`}>
                    cancel
                </button>
            </div>
            { openDeleteModal && <DeleteConfirmModal 
                    text={`This booking invitation on ${booking.property.name} listing will be cancelled. Do you wish to proceed?`}                
                    onClose={onClose} 
                    onConfirm={onConfirm}
                /> 
            }
        </>
    )
}

export default BookingCard