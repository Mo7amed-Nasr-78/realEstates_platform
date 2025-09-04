const Loader = () => {
    return (
        <div className={`loader absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-(--bg-color) flex items-center justify-center z-[38]`}>
            <div className="flex flex-col gap-0">
                <div className="flex items-center justify-center gap-4">
                    <div className="circle w-5 h-5 rounded-full bg-(--primary-color)"></div>
                    <div className="circle w-5 h-5 rounded-full bg-(--primary-color)"></div>
                    <div className="circle w-5 h-5 rounded-full bg-(--primary-color)"></div>
                </div>
                <div className="flex items-center justify-center gap-4">
                    <div className="shadow w-5 h-2 rounded-full blur-xs bg-(--black-color)"></div>
                    <div className="shadow w-5 h-2 rounded-full blur-xs bg-(--black-color)"></div>
                    <div className="shadow w-5 h-2 rounded-full blur-xs bg-(--black-color)"></div>
                </div>
            </div>
        </div>
    )
}

export default Loader;