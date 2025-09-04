function Modal({ children }) {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgb(41,44,51,0.8)] z-50 px-4 sm:px-0">
            <div className="modal border border-(--secondary-text) rounded-3xl">
                { children }
            </div>
        </div>
    )
}

export default Modal;