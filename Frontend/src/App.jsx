import React, { useCallback, useEffect, useState } from "react";
import { PropsContext } from "./components/PropsContext";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";
import { io } from 'socket.io-client';
// Pages
const Role = React.lazy(() => import('./Pages/auth/Role'));
const Signup = React.lazy(() => import('./Pages/auth/Signup'))
const Signin = React.lazy(() => import('./Pages/auth/Signin'));
const Forgetpassword = React.lazy(() => import('./Pages/auth/Forgetpassword'));
const Otp = React.lazy(() => import('./Pages/auth/Otp'));
const Resetpassword = React.lazy(() => import('./Pages/auth/Resetpassword'));
const Home = React.lazy(() => import("./Pages/Home"));
const Listings = React.lazy(() => import('./Pages/Listings'));
const Profile = React.lazy(() => import('./Pages/Profile'));
const Stats = React.lazy(() => import('./Pages/Stats'));
const Favorites = React.lazy(() => import('./Pages/Favorites'));
const AddProperty = React.lazy(() => import('./Pages/AddProperty'));
const PropertyDetails = React.lazy(() => import('./Pages/PropertyDetails'));
const ProfileDetails = React.lazy(() => import('./Pages/ProfileDetails'));
const Bookings = React.lazy(() => import('./Pages/Bookings'));
import ChatList from "./components/ChatList";
import Chat from "./components/Chat";
import MessagesLayout from "./Pages/MessagesLayout";
// Style
import "./style.css";
import Alert from "./components/Alert";
import { initSSE } from "../utils/initSSE";


function App() {
	
	const url = import.meta.env.VITE_PUBLIC_APP_URL;
	const navigate = useNavigate();
	const [ page, setPage ] = useState(1);
	const [ user, setUser ] = useState(null);
	const [ favorites, setFavorites ] = useState([]);
	const [ newFavorite, setNewFavorite ] = useState(null);
	const [ newNotification, setNewNotification ] = useState(null);
	const [ isLoading, setIsLoading ] = useState(false);

	// Socket States
	const [ socket, setSocket ] = useState(null);
	const [ connectionStatus, setConnectionStatus ] = useState(false);

	// Socket.io and Sse connection
	useEffect(() => {
		if (!user) return;

		// Socket
		const socket = io(url, {
			withCredentials: true,
			reconnection: true,
			reconnectionDelay: 1000,
			query: {
				userId: user?._id
			},
		});

		socket.on("connect", () => {
			setConnectionStatus(true);
			setSocket(socket);
		})

		socket.on("disconnect", (reason) => {
			console.log("Disconnection event:", {
				reason: reason,
			});
		});

		// Sse
		const sse = initSSE(`${url}/events`);

		const handleNotification = (event) => {
			const newNotification = JSON.parse(event.data);
			setNewNotification(newNotification);
		}

		sse.addEventListener("newNotification", handleNotification);
		// That is gonna run on app end
		return () => {
			socket.disconnect();;
			sse.removeEventListener("newNotification", handleNotification);
			sse.close();
		}

	}, [user?._id]);

	useEffect(() => {
		const checkUserSession = async () => {
			setIsLoading(true);
			try {
				const res = (
					await axios.get(`${url}/api/users/current`, {
						withCredentials: true,
					})
				).data;
				setUser(res.user);
			} catch (err) {
				setUser(null);
				if (err.status !== 401) {
					Alert('error', err.response?.data?.message);
				}
			} finally {
				setIsLoading(false)
			}
		};
		checkUserSession();

	}, []);

	// Favorites list logic
	useEffect(() => {
		if(!user) return;
		const getFavorites = async () => {
			try {
				setIsLoading(true);
				const { data } = await axios.get(
					`${url}/api/favorite/getAll`, 
					{ 
						withCredentials: true,
						params: {
							page: page
						}
					}
				);
				if (data.favorites.length > 0) {
					setFavorites(data.favorites);
				}
			} catch (err) {
				Alert('error', err.response?.data?.message);
			} finally {
				setIsLoading(false);
			}
		}
		getFavorites();

	}, [user, page])

	useEffect(() => {

		if (!newFavorite) return;
		const handleFavoritesAPI = async (state, property) => {
			try {
				const res = (await axios.post(
					`${url}/api/favorite/${state}`, 
					{ propertyId: property?._id }, 
					{ withCredentials: true })
				).data;
				Alert('success', res.message);
			} catch (err) {
				if (err.status === 401) {
					Alert('warning', 'please, signin first to continue');
					setTimeout(() => {
						navigate('/signin');
					}, 2500);
				}
			}
		}
		handleFavoritesAPI(newFavorite.state, newFavorite.property)

	}, [newFavorite]);

	const favoriteListChecking = useCallback((property) => {
		if (!favorites.some((favorite) => favorite._id === property._id)) {
			setNewFavorite({ state: 'add', property });
			setFavorites((prevs) => {
				return [ ...prevs, property ]
			});
		} else {
			setNewFavorite({ state: 'delete', property });
			setFavorites(favorites.filter((favorite) => favorite._id !== property._id));
		}
	}, [newFavorite]);

	return (
		<PropsContext.Provider value={
			{ 
				url,
				user,
				setUser,
				isLoading,
				favorites,
				setNewFavorite: (property) => favoriteListChecking(property),
				page,
				setPage,
				newNotification,
				// Socket
				socket,
				connectionStatus,
			}}>
			<Routes>
				<Route path="/" element={<Home />}></Route>
				<Route path="/listings" element={<Listings />}></Route>
				<Route path="/favorites" element={
					<ProtectedRoute
						isLoading={isLoading}
						user={user}
					>
						<Favorites />
					</ProtectedRoute>
				}></Route>
				<Route path="/profile" element={
					<ProtectedRoute
						isLoading={isLoading}
						user={user}
					>
						<Profile />
					</ProtectedRoute>
				}></Route>
				<Route path="/add/property" element={
					<ProtectedRoute
						isLoading={isLoading}
						user={user}
					>
						<AddProperty />
					</ProtectedRoute>
				}></Route>
				<Route path="/messages" element={
					<ProtectedRoute
						isLoading={isLoading}
						user={user}
					>
						<MessagesLayout />
					</ProtectedRoute>
				}>
					<Route index element={<ChatList />}></Route>
					<Route path=":id" element={<Chat />}></Route>
				</Route>
				<Route path="/stats" element={
					<ProtectedRoute
						isLoading={isLoading}
						user={user}
					>
						<Stats />
					</ProtectedRoute>
				}></Route>
				<Route path="/bookings" element={
					<ProtectedRoute
						isLoading={isLoading}
						user={user}
					>
						<Bookings />
					</ProtectedRoute>
				}></Route>
				<Route path="/listing/:id" element={<PropertyDetails />} ></Route>
				<Route path="/profile/:id" element={<ProfileDetails />} ></Route>
				
				<Route path="/role" element={<Role />}></Route>
				<Route path="/signup" element={<Signup />}></Route>
				<Route path="/signin" element={<Signin />}></Route>
				<Route path="/forgetpassword" element={<Forgetpassword />}></Route>
				<Route path="/otp" element={<Otp />}></Route>
				<Route path="/resetpassword" element={<Resetpassword />}
				></Route>
			</Routes>
			<ToastContainer />
		</PropsContext.Provider>
	);
}

export default App;
