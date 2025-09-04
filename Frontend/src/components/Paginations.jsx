import { useState } from "react";
import {
    PiCaretLeft,
    PiCaretRight,
} from 'react-icons/pi';
import { useProps } from "./PropsContext";

function Pagination() {

    const { page, setPage } = useProps();
    const [ pageNums, setPageNums ] = useState([1,2,3,4,5]);

    const handleClick = (click) => {
        const newSet = [];
        const min = Math.min(...pageNums);
        const max = Math.max(...pageNums);

        switch (click) {
            case 'right':
                if (max === 20) return;
                for (const num of pageNums) {
                    newSet.push(num + 5);
                }
                setPageNums(newSet);
                break;
            case 'left':
                if (min === 1) return;
                for (const num of pageNums) {
                    newSet.push(num - 5);
                }
                setPageNums(newSet);
                break;
            default: 
                break;
        }
    }

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-25">
            <div onClick={() => handleClick('left')} className="min-w-6 h-6 sm:min-w-10 sm:h-10 flex items-center justify-center rounded-full border border-(--primary-color) text-base sm:text-2xl text-(--primary-text) duration-300 ease-in-out bg-transparent hover:bg-(--primary-color) cursor-pointer">
                <PiCaretLeft />
            </div>
            {
                pageNums.map((pageNum, idx) => {
                    return (
                        <div key={idx} onClick={() => { setPage(pageNum) }} className={`${page === pageNum? 'bg-(--primary-color) text-(--primary-text)': 'bg-transparent'} min-w-10 h-10 sm:min-w-13 sm:h-13 flex items-center justify-center rounded-full border-1 border-(--primary-color) font-Plus-Jakarta-Sans font-normal text-lg text-(--primary-color) hover:text-(--primary-text) duration-300 ease-in-out hover:bg-(--primary-color) cursor-pointer`}>
                            { pageNum }
                        </div>
                    )
                })
            }
            <div onClick={() => handleClick('right')} className="min-w-6 h-6 sm:min-w-10 sm:h-10 flex items-center justify-center rounded-full border border-(--primary-color) text-base sm:text-2xl text-(--primary-text) duration-300 ease-in-out bg-transparent hover:bg-(--primary-color) cursor-pointer">
                <PiCaretRight />
            </div>
        </div>
    )
}

export default Pagination;