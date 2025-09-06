import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProps } from "../PropsContext";
import Dropdown from "../Dropdown";
import axios from "axios";
import { 
	PiHeartLight,
	PiBellLight,
	PiChatTeardropLight,
	PiUser,
	PiSignIn,
	PiChartPieSlice,
	PiUploadSimple,
	PiSignOut,
	PiListLight,
	PiTicket,
	PiBuildings,
	PiOfficeChair
} from "react-icons/pi";
import { initSSE } from "../../../utils/initSSE";
import Alert from "../Alert";

function UserProfile() {

	const { url, user, setUser, favorites } = useProps();
	const navigate = useNavigate();

	// Component states
	const [ select, setSelect ] = useState(null);
	const [ notifications, setNotifications ] = useState([]);
	const [ unreadNotifications, setUnreadNotifications ] = useState(0);
	const [ openNotifications, setOpenNotifications ] = useState(false);
	const [ windowWidth, setWindowWidth ] = useState(0);

	// Component Refs
	const notificationListRef = useRef(null);

	const listData = useMemo(() => {
		if (!user) return { items: [], icons: [] };

		if (user.role !== 'agent') {
			if (windowWidth < 992) {
				return {
					items: ['profile', 'listings', 'favorites', 'messages', 'agents', 'sign out'],
					icons: [<PiUser />, <PiBuildings />, <PiHeartLight />, <PiChatTeardropLight />, <PiOfficeChair/>, <PiSignOut />]
				};
			} else {
				return {
					items: ['profile', 'sign out'],
					icons: [<PiUser />, <PiSignOut />]
				};
			}
		}

		if (windowWidth < 992) {
			return {
				items: ['profile', 'listings', 'favorites', 'messages', 'agents', 'stats', 'bookings',  'add property', 'sign out'],
				icons: [<PiUser />, <PiBuildings />, <PiHeartLight />, <PiChatTeardropLight />, <PiOfficeChair/>, <PiChartPieSlice />, <PiTicket />, <PiUploadSimple />, <PiSignOut />]
			}
		} else {
			return {
				items: ['profile', 'stats', 'bookings',  'add property', 'sign out'],
				icons: [<PiUser />, <PiChartPieSlice />, <PiTicket />, <PiUploadSimple />, <PiSignOut />]
			};
		}
		
	}, [user?.role, windowWidth]);

	useEffect(() => {

		switch(select) {
			case 'profile':
				navigate('/profile');
				break;
			case 'stats':
				navigate('/stats');
				break;
			case 'add property':
				navigate('/add/property');
				break;
			case 'bookings':
				navigate('/bookings');
				break;
			case 'listings':
				navigate('/listings');
				break;
			case 'agents':
				// navigate('/agents');
				break;
			case 'messages':
				navigate('/messages');
				break;
			case 'favorites':
				navigate('/favorites');
				break;
			case 'signin':
				navigate('/signin');
				break;
			case 'signup':
				navigate('/signup');
				break;
			case 'sign out':
				signOut();
				break;
		}
	}, [select])

	useEffect(() => {
		if (!user) return;

		const getNotifications = async () => {
			try {
				const res = (await axios.get(
					`${url}/api/notification/get`,
					{
						withCredentials: true,
					}
				)).data;
				setUnreadNotifications(res.unreadNotifications.length);
				setNotifications(res.allNotifications);
			} catch (err) {
				console.log(err);
			}
		}
		getNotifications();

		function handleClickOutside(event) {
		if (notificationListRef.current && !notificationListRef.current.contains(event.target)) {
			setOpenNotifications(false);
		}
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
	}, [user])

	useEffect(() => {
		if (!user) return;
		const es = initSSE(`${url}/events`);

		const handleNotification = (event) => {
			const notification = JSON.parse(event.data);
			setUnreadNotifications((prev) => prev + 1);
			setNotifications((prevs) => [ ...prevs, notification ].reverse());
			console.log(notification);
		}

		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		}
		handleResize();

		window.addEventListener('resize', handleResize);
		es.addEventListener("notification", handleNotification);
		return () => {
			es.removeEventListener("notification", handleNotification);
			window.removeEventListener('resize', handleResize);
		}
	}, [url]);

	const readNotifications = useCallback(async () => {
		if (unreadNotifications < 1) return;
		const currentNotifications = [...notifications];
		const unreadCount = unreadNotifications;

		setUnreadNotifications(0);
		setNotifications((prevs) => {
			return prevs.map((notification) => {
				return !notification.read? { ...notification, read: true } : notification;
			})
		})

		try {
			await axios.put(
				`${url}/api/notification/read`,
				null,
				{
					withCredentials: true
				}
			);
		} catch (err) {
			console.log(err);
			setUnreadNotifications(unreadCount);
			setNotifications(currentNotifications);
		}
	}, [unreadNotifications, notifications]);

	const clearNotifications = useCallback(async (event) => {
		if (notifications.length < 1) return;
		event.target.disabled = true;
		try {
			const res = (await axios.delete(
				`${url}/api/notification/clearAll`,
				{
					withCredentials: true
				}
			)).data;
			Alert('success', res.message);
			setNotifications([]);
		} catch (err) {	
			console.log(err);
		}
		event.target.disabled = false;
	}, [])

	const signOut = useCallback(async () => {
		try {
			(await axios.get(
				`${url}/api/users/logout`,
				{ withCredentials: true }
			)).data
			setUser(null);
		} catch (err) {
			console.log(err)
		}
	}, []);


	return (
		<div className="flex items-center justify-center gap-4">
			{!user? (
				<>
					<div className="hidden md:flex items-center gap-4">
						<Link to={"/signin"}>
							<button className="text-xl font-Playfair text-(--primary-text) capitalize transition-all duration-300 ease-in-out hover:text-(--primary-color) cursor-pointer">
								sign in
							</button>
						</Link>
						<Link to={"/role"}>
							<button className="flex items-center justify-center gap-2 px-10 py-3 rounded-[20px] text-(--black-color) bg-(--primary-color) cursor-pointer transition duration-300 ease-in-out hover:scale-95">
								<PiSignIn className="text-2xl" />
								<h4 className="text-xl font-Playfair font-semibold capitalize">
									sign up
								</h4>
							</button>
						</Link>
					</div>
					<div className="md:hidden">
						<Dropdown
								items={['signin', 'signup']}
								icons={[<PiSignIn />, <PiSignOut />]}
								classes={'w-58 right-0'}
								onSelect={(value) => setSelect(value)}
							>
							<div className="w-10 h-10 flex md:hidden items-center justify-center rounded-full bg-[#51c20624] cursor-pointer transition duration-300 ease-in-out hover:scale-95">
								<PiListLight className="text-2xl text-(--primary-text)"/>
							</div>
						</Dropdown>
					</div>
				</>
			) : (
				<div className="flex items-center gap-2">
					<Link to='/messages' className="hidden sm:block">
						<div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#51c20624] cursor-pointer transition duration-300 ease-in-out hover:scale-95">
							<PiChatTeardropLight className="text-xl text-(--primary-text)" />
						</div>
					</Link>
					<Link to='/favorites' className="hidden sm:block">
						<div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#51c20624] cursor-pointer transition duration-300 ease-in-out hover:scale-95">
							<PiHeartLight className="text-xl text-(--primary-text)" />
							<div className={`${favorites.length > 0? 'block': 'hidden'} absolute top-3 right-2 w-2 h-2 rounded-full bg-red-600 border-2 border-(--bg-color)`}></div>
						</div>
					</Link>
					<div onClick={readNotifications} className="sm:relative">
						<div onClick={() => setOpenNotifications(!openNotifications)} className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#51c20624] cursor-pointer transition duration-300 ease-in-out hover:scale-95">
							<PiBellLight className="text-xl text-(--primary-text)" />
							<div className={`${unreadNotifications > 0? 'block': 'hidden'} absolute top-3 right-3 w-2 h-2 rounded-full bg-red-600 border-2 border-(--bg-color)`}></div>
						</div>
						<div ref={notificationListRef} className={`${openNotifications? 'block': 'hidden'} absolute right-0 w-full sm:w-86 dropdown p-4 sm:p-3 mt-2 bg-(--bg-color) outline outline-offset-1 outline-white/10 rounded-xl shadow shadow-white/10 z-10 origin-top`}>
							<div className="flex items-center justify-between pb-2">
								<h2 className="font-Plus-Jakarta-Sans font-normal text-lg text-(--primary-text) capitalize">notifications</h2>
								<button onClick={clearNotifications} className="font-Plus-Jakarta-Sans font-normal text-sm text-(--primary-color) capitalize text-center hover:underline cursor-pointer">clear all</button>
							</div>
							<ul className={`h-86 flex flex-col gap-1.5 overflow-y-scroll scrollbar-none`}>
								{
									notifications.length > 0? 
										notifications.map((item, idx) => (
											<Link key={idx} to={`/bookings`}>
												<li
													className={`${!item.read? 'bg-[rgb(81,194,6,0.06)]': 'bg-transparent'} relative w-full flex items-start gap-3 px-2 py-3 rounded-lg duartion-300 ease-in-out text-(--secondary-text) hover:bg-[rgb(81,194,6,0.1)] cursor-pointer before:absolute before:w-full before:bottom-0 before:left-0 before:border-b before:border-[rgb(81,194,6,0.2)]`}
													>
														<img src={item.sender.picture} alt="image" className="w-12 h-12 rounded-full border border-(--primary-color)" />
														<div className="flex flex-col">
															<span className="font-Plus-Jakarta-Sans font-light text-sm text-left first-letter:capitalize mb-1">
																<span className="text-(--primary-color)"> { item.sender.name } </span>
																{item.content}
															</span>
															<div className="flex items-center justify-between">
																<h5 className="font-Plus-Jakarta-Sans font-light text-xs text-(--secondary-text) text-start">{ new Date(item.createdAt).toLocaleDateString('en-Eg', { timeZone: 'Africa/Cairo', dateStyle: 'long' }) }</h5>
																<h5 className="font-Plus-Jakarta-Sans font-light text-xs text-(--secondary-text) text-start">{ new Date(item.createdAt).toLocaleTimeString('en-Eg', { timeZone: 'Africa/Cairo', timeStyle: 'short' }) }</h5>
															</div>
														</div>
												</li>
											</Link>
										))
									:
										<div className="w-full h-full flex flex-col items-center justify-center gap-2">
											<img src="/notifications.webp" alt="icon" className="w-32"/>
											<h5 className="font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">no notifications found</h5>
										</div>
								}
							</ul>
							<Link to={''} className="inline-block w-full pt-2">
								<span className="inline-block w-full font-Plus-Jakarta-Sans font-medium text-sm text-(--primary-color) capitalize text-center">all notifications</span>
							</Link>
						</div>
					</div>
					<Dropdown
						items={listData.items}
						icons={listData.icons}
						classes={'w-58 right-0'}
						onSelect={(value) => setSelect(value)}
					>
						<div className="w-14 h-14 hidden sm:flex items-center justify-center rounded-full overflow-hidden border-[2px] border-(--primary-color) bg-[#51c20624] cursor-pointer transition duration-300 ease-in-out hover:scale-95">
							<img
								src={user.picture}
								alt="image"
								className="w-full h-full object-fit aspect-square"
							/>
						</div>
						<div className="w-10 h-10 flex sm:hidden items-center justify-center rounded-full bg-[#51c20624] cursor-pointer transition duration-300 ease-in-out hover:scale-95">
							<PiListLight className="text-2xl text-(--primary-text)"/>
						</div>
					</Dropdown>
				</div>
			)}
		</div>
	);
}

export default UserProfile;
