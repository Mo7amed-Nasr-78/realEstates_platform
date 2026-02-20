import { useRef } from "react";
import { useState, memo, useCallback } from "react";
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";

const Pagination = memo(function Pagination({ setPage }) {
	const numsRef = useRef();
	const [pageNums, setPageNums] = useState([1, 2, 3, 4, 5]);

	const handleClick = (click) => {
		const newSet = [];
		const min = Math.min(...pageNums);
		const max = Math.max(...pageNums);

		switch (click) {
			case "right":
				if (max === 20) return;
				for (const num of pageNums) {
					newSet.push(num + 5);
				}
				setPageNums(newSet);
				break;
			case "left":
				if (min === 1) return;
				for (const num of pageNums) {
					newSet.push(num - 5);
				}
				setPageNums(newSet);
				break;
			default:
				break;
		}
	};

	const handlePage = useCallback((num) => {
		setPage?.(num);

		window.scrollTo({
			behavior: "smooth",
			top: 0
		});

		numsRef.current.querySelectorAll("li").forEach((li) => {
			if (Number(li.innerText) === num) {
				li.classList.add("bg-(--primary-color)", "text-(--primary-text)");
			} else {
				li.classList.remove("bg-(--primary-color)", "text-(--primary-text)");
			}
		})
	}, []);

	return (
		<div className="flex items-center justify-center gap-2 sm:gap-4 mt-25">
			<div
				onClick={() => handleClick("left")}
				className="min-w-6 h-6 sm:min-w-10 sm:h-10 flex items-center justify-center rounded-full border border-(--primary-color) text-base sm:text-2xl text-(--primary-text) duration-300 ease-in-out bg-transparent hover:bg-(--primary-color) cursor-pointer"
			>
				<PiCaretLeft />
			</div>
			<ul ref={numsRef} className="flex items-center gap-2">
				{pageNums.map((num, idx) => {
					return (
						<li
							key={idx}
							onClick={() => {
								handlePage(num);
							}}
							className={`min-w-10 h-10 sm:min-w-13 sm:h-13 flex items-center justify-center rounded-full border-1 border-(--primary-color) font-Plus-Jakarta-Sans font-normal text-lg text-(--primary-color) hover:text-(--primary-text) duration-300 ease-in-out hover:bg-(--primary-color) cursor-pointer select-none`}
						>
							{ num }
						</li>
					);
				})}
			</ul>
			<div
				onClick={() => handleClick("right")}
				className="min-w-6 h-6 sm:min-w-10 sm:h-10 flex items-center justify-center rounded-full border border-(--primary-color) text-base sm:text-2xl text-(--primary-text) duration-300 ease-in-out bg-transparent hover:bg-(--primary-color) cursor-pointer"
			>
				<PiCaretRight />
			</div>
		</div>
	);
});

export default Pagination;
