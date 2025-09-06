import { useRef, useState, useEffect } from "react";

function Dropdown({ children, items, icons = [], onSelect, classes }) {

    const dropdownRef = useRef(null);
    const [ open, setOpen ] = useState(false);

    const handleSelect = (item) => {
        onSelect?.(item);
        setOpen(false);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative">
            <div onClick={() => setOpen((prev) => !prev)}>
                { children }
            </div>
            {
                open && (
                    <ul ref={dropdownRef} className={`${classes} ${items.length > 10? 'h-52': ''} dropdown p-1.5 sm:p-3 absolute mt-2 bg-(--bg-color) outline outline-offset-1 outline-white/10 rounded-xl shadow shadow-white/10 z-40 overflow-hidden origin-top`}>
                        {
                            items.map((item, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => handleSelect(item)}
                                    className={`group w-full flex items-center gap-2 px-2 py-2 rounded-md duartion-300 ease-in-out text-(--primary-text) hover:bg-[rgb(81,194,6,0.1)] cursor-pointer`}
                                    >
                                        <span className={`${icons.length < 1? 'hidden': 'block'} text-lg p-2 rounded-sm bg-(--secondary-color) group-hover:bg-[rgb(56,64,84,1)]`}>
                                            {icons[idx]}
                                        </span>
                                        <span className="font-Plus-Jakarta-Sans font-normal text-sm text-left first-letter:capitalize">
                                            {item}
                                        </span>
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        </div>
    )
}

export default Dropdown;