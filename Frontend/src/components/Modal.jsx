function Modal({ children }) {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[rgb(41,44,51)]/80 z-50 px-4 sm:px-0">
            <div className="relative w-full h-11/12 max-h-11/12 flex flex-col items-center sm:justify-center overflow-y-scroll scrollbar-none">
                <div className="modal border border-(--secondary-text) rounded-3xl">
                    { children }
                </div>
            </div>
        </div>
    )
}

export default Modal;