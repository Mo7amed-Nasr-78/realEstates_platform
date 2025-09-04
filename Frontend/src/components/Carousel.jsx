import { useRef, useState } from "react";
import {
    PiArrowRight,
    PiArrowLeft,
    PiArrowUp,
    PiArrowDown
} from 'react-icons/pi';

function Carousel({ children, carouselContainerClasses, carouselClasses }) {

    const listingsCarousel = useRef(null);
    const carouselLeft = useRef(null);
    const carouselRight = useRef(null);
    const [ scrolled, setScrolled ] = useState(0);


    const handleCarouselRight = () => {
        const carousel = listingsCarousel.current;
        const leftArrow = carouselLeft.current;
        const rightArrow = carouselRight.current;

        if (carousel) {
            const gap = parseInt(window.getComputedStyle(carousel).gap);
            const carouselWidth = (carousel.scrollWidth - carousel.clientWidth);
            let newScrolled;

            if (scrolled < carouselWidth) {
                newScrolled = scrolled + carousel.clientWidth + gap
                carousel.scrollTo({
                    behavior: 'smooth',
                    left: newScrolled
                })
                setScrolled(newScrolled);

                if (leftArrow) {
                    leftArrow.parentElement.classList.remove('hidden');
                    leftArrow.parentElement.classList.add('flex', 'items-center', 'justify-center');
                }

            }

            if (rightArrow && newScrolled >= carouselWidth) {
                rightArrow.parentElement.classList.add('hidden');
                rightArrow.parentElement.classList.remove('flex', 'items-center', 'justify-center');
            }
        }
    }

    const handleCarouselLeft = () => {
        const carousel = listingsCarousel.current;
        const leftArrow = carouselLeft.current;
        const rightArrow = carouselRight.current;

        const gap = parseInt(window.getComputedStyle(carousel).gap);

        if (carousel) {
            const carouselWidth = (carousel.scrollWidth - carousel.clientWidth);
            if (scrolled > 0) {
                const newScrolled = scrolled - carousel.clientWidth - gap;
                carousel.scrollTo({
                    behavior: 'smooth',
                    left: newScrolled
                })
                setScrolled(newScrolled);

                if (leftArrow && newScrolled === 0) {
                    leftArrow.parentElement.classList.add('hidden');
                    leftArrow.parentElement.classList.remove('flex', 'items-center', 'justify-center');
                }

                if (rightArrow && newScrolled < carouselWidth) {
                    rightArrow.parentElement.classList.remove('hidden');
                    rightArrow.parentElement.classList.add('flex', 'items-center', 'justify-center');
                }
            }
        }
    }

    return (
        <div className={carouselContainerClasses}>
            <div className={`hidden group absolute top-0 left-0 duration-300 ease-in-out sm:w-52 h-full sm:bg-linear-to-r from-(--bg-color) to-transparent z-10`}>
                <div ref={carouselLeft} onClick={handleCarouselLeft} className="w-14 h-14 flex items-center justify-center translate-x-8 sm:-translate-x-14 group-hover:translate-x-0 rounded-full border border-(--primary-text) bg-(--primary-color) sm:bg-transparent text-3xl text-(--primary-text) duration-300 ease-in-out sm:hover:bg-(--primary-color) cursor-pointer hover:scale-95 z-10 shadow-2xl shadow-black sm:shadow">
                    <PiArrowLeft />
                </div>
            </div>
            <div ref={listingsCarousel} className={carouselClasses}>
                {
                    children
                }
            </div>
            <div className={`group absolute top-0 right-0 duration-300 ease-in-out sm:w-52 h-full flex items-center justify-center sm:bg-linear-to-r from-transparent to-(--bg-color) z-10`}>
                <div ref={carouselRight} onClick={handleCarouselRight} className="w-14 h-14 flex items-center justify-center -translate-x-8 sm:translate-x-14 group-hover:translate-x-0 rounded-full border border-(--primary-text) bg-(--primary-color) sm:bg-transparent text-3xl text-(--primary-text) duration-300 ease-in-out sm:hover:bg-(--primary-color) cursor-pointer hover:scale-95 z-10 shadow-2xl shadow-black sm:shadow">
                    <PiArrowRight />
                </div>
            </div>
        </div>
    )
}

export default Carousel;