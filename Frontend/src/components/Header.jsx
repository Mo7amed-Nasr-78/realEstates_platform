import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavList from "./NavList";
import UserProfile from "./UserProfile";
import "../style.css";

const Header = React.memo(function Header() {

	const [scrolling, setScrolling] = useState(false);

	useEffect(() => {

		if (window.scrollY > 0) {
			setScrolling(true);
		}

		function handleScroll() {
			if (window.scrollY > 0) {
				setScrolling(true);
			} else {
				setScrolling(false);
			}
		}
		
		window.addEventListener('scroll', handleScroll);
		
		// cleanup function to avoids Memory lacks
		return () => {
			window.removeEventListener("scroll", handleScroll);
		}
	}, []);

	return (
		<header className={`fixed w-full transition-all duration-200 ease-in z-40 ${scrolling? 'top-0 shadow-(--header-shadow) bg-(--bg-color)' : 'top-2 lg:top-8'}`}>
			<div className={`relative container m-auto flex items-center justify-between py-3 border-0 lg:border-2 duration-300 ease-in-out ${scrolling? 'border-transparent': 'rounded-full border-(--primary-color) lg:px-6'}`}>
				<div className="flex items-center gap-18">
                    <Link to="/">
						<img
							src="/logo.svg"
							alt="logo"
							// loading="lazy"
							className="h-12 select-none"
						/>
					</Link>
					<NavList />
				</div>
                <UserProfile/>
			</div>
		</header>
	);
})



export default Header;
