import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProps } from "./PropsProvider";
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
import api from "../../utils/axiosInstance";
// Components
import Alert from "./Alert";
import Dropdown from "./Dropdown";

function UserProfile() {

	const {  
		user,
		setUser,
		setToken,
		favorites,
		newNotification,
		socket,
		connectionStatus,
	} 
	= useProps();
	const navigate = useNavigate();

	// Component states
	const [ select, setSelect ] = useState(null);
	const [ windowWidth, setWindowWidth ] = useState(0);

	// Notifications State
	const [ notifications, setNotifications ] = useState([]);
	const [ unreadNotifications, setUnreadNotifications ] = useState(0);
	const [ openNotifications, setOpenNotifications ] = useState(false);

	// Messages State
	const [ chats, setChats ] = useState([]);
	const [ openMsgs, setOpenMsgs ] = useState(false);
	const [ newMsg, setNewMsg ] = useState(false);

	// Component Refs
	const notificationListRef = useRef(null);
	const messagesListRef = useRef(null);

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
		
	}, [user, windowWidth]);

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
				const { data: { allNotifications, unreadNotifications } } = await api.get(
					`/api/notification/get`,
				);

				setUnreadNotifications(unreadNotifications.length);
				setNotifications(allNotifications);
			} catch (err) {
				if (err.response) {
					Alert('error', err.response.data.message);
				} else {
					console.log(err);
				}
			}
		}
		getNotifications();

		const getChats = async () => {
			try {
				const { data: { conversations } } = await api.get(
					`/api/chat/conversations`,
				);

				setChats(conversations);
			} catch (err) {
				if (err.response) {
					Alert('error', err.response.data.message);
				} else {
					console.log(err);
				}
			}
		}
		getChats();

		function handleClickOutside(event) {
			if (notificationListRef.current && !notificationListRef.current.contains(event.target)) {
				setOpenNotifications(false);
			}

			if (messagesListRef.current && !messagesListRef.current.contains(event.target)) {
				setOpenMsgs(false);
			}
        }

		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		}
		handleResize();
		
        document.addEventListener("mousedown", handleClickOutside);
		window.addEventListener('resize', handleResize);

        return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			window.removeEventListener('resize', handleResize);
        };
	}, [user])

	useEffect(() => {
		if (!newNotification) return;

		setUnreadNotifications((prev) => prev + 1);
		setNotifications((prevs) => {
			return [ ...prevs, newNotification ].reverse();
		})

	}, [newNotification]);

	useEffect(() => {
		if (!socket || !connectionStatus) return;

		socket.on('newMessage', (newMsg) => {
			setNewMsg(true);
			setChats((prevs) => {
				return prevs.map((chat) => {
					if (chat._id === newMsg.chat._id) {
						return { ...chat, lastMessage: newMsg }
					} else {
						return chat;
					}
				})
			})
		})

		socket.on('deleteMessage', (deletedMsg) => {
			setChats((prevs) => {
				return prevs.map((chat) => {
					if (chat._id === deletedMsg.chat) {
						return { ...chat, lastMessage: { ...deletedMsg, content: 'Msg Deleted' } }
					} else {
						return chat;
					}
				})
			})
        })

		socket.on('newChat', (newChat) => {
			setNewMsg(true)
			setChats((prevs) => {
				if (!prevs.some((chat) => chat._id === newChat._id)) {
					return [ ...prevs, newChat ].reverse();
				}
			})
        })

		return () => {
			socket.off('newMessage');
			socket.off('deleteMessage');
			socket.off('newChat');
		}

	}, [socket, connectionStatus])

	const readNotifications = async () => {
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
			await api.put(
				`/api/notification/read`,
				null,
			);
		} catch (err) {
			setUnreadNotifications(unreadCount);
			setNotifications(currentNotifications);
			if (err.response) {
				Alert('error', err.response.data.message);
			} else {
				console.log(err);
			}
		}
	};

	const clearNotifications = async (event) => {
		if (notifications.length < 1) return;
		event.target.disabled = true;
		try {
			const { data: { message } } = await api.delete(
				`/api/notification/clearAll`,
			);
			Alert('success', message);
			setNotifications([]);
		} catch (err) {
			if (err.response) {
				Alert('error', err.response.data.message);
			} else {
				console.log(err);
			}
		}
		event.target.disabled = false;
	};

	const signOut = async () => {
		try {
			await api.post(
				`/api/users/signout`,
			)
			setUser(null);
			setToken('');
		} catch (err) {
			if (err.response) {
				Alert('error', err.response.data.message);
			} else {
				console.log(err);
			}
		}
	};

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
				
					<div className="hidden sm:block sm:relative">
						<div onClick={() => { setNewMsg(false); setOpenMsgs(!openMsgs) }} className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#51c20624] cursor-pointer transition duration-300 ease-in-out hover:scale-95">
							<PiChatTeardropLight className="text-xl text-(--primary-text)" />
							<div className={`${newMsg? 'block': 'hidden'} absolute top-3 right-3 w-2 h-2 rounded-full bg-red-600 border-2 border-(--bg-color)`}></div>
						</div>
						<div ref={messagesListRef} className={`${openMsgs? 'block': 'hidden'} absolute right-0 w-full sm:w-86 dropdown p-4 sm:p-3 mt-2 bg-(--bg-color) outline outline-offset-1 outline-white/10 rounded-xl shadow shadow-white/10 z-10 origin-top`}>
							<div className="flex items-center justify-start pb-2">
								<h2 className="font-Plus-Jakarta-Sans font-normal text-lg text-(--primary-text) capitalize">messages</h2>
							</div>
							<ul className={`h-86 flex flex-col gap-1.5 overflow-y-scroll scrollbar-none`}>
								{
									chats.length > 0? 
										chats.map((chat, idx) => (
											<Link key={idx} to={`/messages/${chat._id}`}>
												<li
													className={`${chat.lastMessage.receiver === user._id && !chat.lastMessage.read? 'bg-[rgb(81,194,6,0.06)]': 'bg-transparent'} relative w-full flex items-start gap-3 px-2 py-3 rounded-lg duartion-300 ease-in-out text-(--secondary-text) hover:bg-[rgb(81,194,6,0.1)] cursor-pointer before:absolute before:w-full before:bottom-0 before:left-0 before:border-b before:border-[rgb(81,194,6,0.2)]`}
													>
														<img src={chat.otherUser.picture} alt="image" className="w-12 h-12 rounded-full border border-(--primary-color)" />
														<div className="w-full flex flex-col">
															<div className="w-full flex flex-col">
																<div className="w-full flex items-center justify-between">
																	<h3 className="font-Plus-Jakarta-Sans font-light text-base text-left first-letter:capitalize text-(--primary-text) line-clamp-1"> { chat.otherUser.name }</h3>
																	<span className="font-Plus-Jakarta-Sans text-xs text-(--secondary-text)">{ new Date(chat.lastMessage.createdAt).toLocaleDateString('en-Eg', { dateStyle: 'short', timeZone: 'Africa/Cairo' }) } - { new Date(chat.lastMessage.createdAt).toLocaleTimeString('en-Eg', { timeStyle: 'short', timeZone: 'Africa/Cairo' }) }</span>
																</div>
																<div className="w-full flex items-center justify-between">
																	<div className="font-Plus-Jakarta-Sans text-(--secondary-text) font-light text-sm flex items-center gap-1">
																		<span className={`${chat.lastMessage.receiver === user._id? 'hidden': 'block'}`}>Me:</span>
																		<h4 className="w-full text-left text-nowrap line-clamp-1">{ chat.lastMessage.content }</h4>
																	</div>
																	<span className={`${chat.lastMessage.receiver === user._id && !chat.lastMessage.read? 'block' : 'hidden'} w-2 h-2 rounded-full bg-(--primary-color)`}></span>
																</div>
															</div>
														</div>
												</li>
											</Link>
										))
									:
										<div className="w-full h-full flex flex-col items-center justify-center gap-2">
											<img src="/notifications.webp" alt="icon" className="w-32"/>
											<h5 className="font-Plus-Jakarta-Sans font-normal text-base text-(--secondary-text) capitalize">no Messages found</h5>
										</div>
								}
							</ul>
							<Link to={'/messages'} className="inline-block w-full pt-2">
								<span className="inline-block w-full font-Plus-Jakarta-Sans font-medium text-sm text-(--primary-color) capitalize text-center">all messages</span>
							</Link>
						</div>
					</div>

					<Link to='/favorites' className="hidden sm:block">
						<div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#51c20624] cursor-pointer transition duration-300 ease-in-out hover:scale-95" title="favorites">
							<PiHeartLight className="text-xl text-(--primary-text)" />
							<div className={`${favorites.length? 'block': 'hidden'} absolute top-3 right-2 w-2 h-2 rounded-full bg-red-600 border-2 border-(--bg-color)`}></div>
						</div>
					</Link>

					<div onClick={readNotifications} className="sm:relative">
						<div onClick={() => setOpenNotifications(!openNotifications)} className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#51c20624] cursor-pointer transition duration-300 ease-in-out hover:scale-95">
							<PiBellLight className="text-xl text-(--primary-text)" />
							<div className={`${unreadNotifications? 'block': 'hidden'} absolute top-3 right-3 w-2 h-2 rounded-full bg-red-600 border-2 border-(--bg-color)`}></div>
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
											<li
												key={idx}
												className={`${!item.read? 'bg-[rgb(81,194,6,0.06)]': 'bg-(--primary-color)/3'} relative w-full flex items-start gap-3 px-2 py-3 rounded-lg duartion-300 ease-in-out text-(--secondary-text) cursor-pointer before:absolute before:w-full before:bottom-0 before:left-0 before:border-b before:border-[rgb(81,194,6,0.2)]`}
											>
													<img src={item.sender.picture} alt="image" className="w-12 h-12 rounded-full border border-(--primary-color)" />
													<div className="flex flex-col">
														<span className="font-Plus-Jakarta-Sans font-light text-sm text-left first-letter:capitalize mb-1">
															<Link to={`/profile/${item.sender._id}`}>
																<span className="text-(--primary-color) me-1 underline-offset-2 underline"> { item.sender.name } </span>
															</Link>
															{item.content}
														</span>
														<div className="flex items-center justify-between">
															<h5 className="font-Plus-Jakarta-Sans font-light text-xs text-(--secondary-text) text-start">{ new Date(item.createdAt).toLocaleDateString('en-Eg', { timeZone: 'Africa/Cairo', dateStyle: 'long' }) }</h5>
															<h5 className="font-Plus-Jakarta-Sans font-light text-xs text-(--secondary-text) text-start">{ new Date(item.createdAt).toLocaleTimeString('en-Eg', { timeZone: 'Africa/Cairo', timeStyle: 'short' }) }</h5>
														</div>
													</div>
											</li>
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
