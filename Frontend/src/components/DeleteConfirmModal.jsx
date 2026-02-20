import Modal from "./Modal";
import { useProps } from "./PropsProvider";

function DeleteConfirmModal({ text, onConfirm, onClose }) {
    const { isLoading } = useProps();

    return (
        <Modal>
            <div className="modal border border-(--secondary-text)/25 rounded-3xl my-auto">
                <div className="w-full sm:w-140 rounded-3xl bg-(--bg-color) p-6">
                    <div className="flex flex-col justify-center gap-2 mb-8">
                        <h2 className="font-Playfair font-medium text-3xl text-(--primary-text) capitalize">Confirm Deletion</h2>
                        <h3 className="font-Plus-Jakarta-Sans font-extralight text-base sm:text-lg text-(--secondary-text) first-letter:capitalize">
                            { text }
                        </h3>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <button onClick={onClose} className="h-10 w-26 border rounded-2xl font-Playfair text-base capitalize font-semibold bg-transparent text-(--primary-color) border-(--primary-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95 hover:bg-(--primary-color) hover:text-(--primary-text)">cancel</button>
                        <button onClick={onConfirm} className="h-10 w-26 border rounded-2xl font-Playfair text-base capitalize font-semibold text-[#CC4444] border-[#CC4444] cursor-pointer transition duration-300 ease-in-out hover:scale-95 hover:bg-[#CC4444] hover:text-(--primary-text)">
                            <div className={`${isLoading? 'block': 'hidden'} mx-auto relative h-5 w-5 animate-spin`}>
                                <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-(--red-color) border-t-transparent"></div>
                            </div>
                            <span className={`${isLoading? 'hidden' : 'block'}`}>delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default DeleteConfirmModal;