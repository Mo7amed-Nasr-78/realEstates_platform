import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";
import { io } from 'socket.io-client';
import api, { getAccessToken, setAccessToken } from "../utils/axiosInstance";
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
import { useProps } from "./components/PropsProvider";


function App() {

	const { 
		user, 
		setUser,
		isLoading, 
		// setIsLoading, 
		setSocket, 
		setConnectionStatus,
		setNewNotification,
		setFavorites,
	} 
	= useProps();

	// Socket.io and Sse connection
	const currentUser = async () => {
		try {
			const { data: { user } } = await api.get(
				`/api/users/current`, 
			);

			setUser(user);
			setFavorites(user.favorites);
		} catch (err) {
			setUser(null);
			if (err.status !== 401) {
				Alert('error', err.response?.data?.message);
			}
		}
	};
	
	const refresh = async () => {
		try {
			const { data: { accessToken } } = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
				{},
				{
					withCredentials: true
				}
			);
			setAccessToken(accessToken);
			currentUser();
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		refresh();
	}, []);

	useEffect(() => {
		if (!user) return;

		// Socket
		const socket = io(import.meta.env.VITE_BACKEND_URL, {
			withCredentials: true,
			reconnection: true,
			reconnectionDelay: 1000,
			query: {
				userId: user._id
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
		const sse = initSSE(`${import.meta.env.VITE_BACKEND_URL}/events?accessToken=${getAccessToken()}`);

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

	}, [user]);

	return (
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
			<Route path="/resetpassword" element={<Resetpassword />}></Route>
		</Routes>
	);
}

export default App;
