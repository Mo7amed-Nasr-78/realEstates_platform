import api from "../../utils/axiosInstance";
import { createContext, useContext, useState } from "react";
import Alert from "./Alert";

const PropsContext = createContext();

export const useProps = () => {
    const context = useContext(PropsContext);
    if (!context) {
        throw new Error('useProps must be used within PropsProvider');
    }
    return context;
}

const PropsProvider = ({ children }) => {
    const [ isLoading, setIsLoading ] = useState(false);
    // accessbility
    const [ token, setToken ] = useState('');
    const [ user, setUser ] = useState(null)
    const [ newNotification, setNewNotification ] = useState();
    const [ favorites, setFavorites ] = useState([]);

    // Rea-time connection
    const [ socket, setSocket ] = useState();
    const [ connectionStatus, setConnectionStatus ] = useState();

    const addFavorite = async (id) => {
        if (!id) return;
        try {
            const { data: { message, favorite } } = await api.post(
                `/api/favorite/add`,
                {
                    propertyId: id
                },
            );

            setFavorites((prev) => {
                return [ ...prev, {
                    _id: favorite._id,
                    property: favorite.property
                }];
            })
            Alert("success", message);
        } catch (err) {
            if (err.response) {
                if (err.response?.status === 401) {
                    Alert("Please, sign in first");
                }
                
            } else {
                console.log(err)
            }
        }
    }

    const removeFavorite = async (id) => {
        if (!id) return;
        try {
            const { data: { message, deletedFavorite } } = await api.post(
                `/api/favorite/remove`,
                {
                    propertyId: id
                },
            );
            setFavorites((prev) => {
                return prev.filter((i) => i.property !== deletedFavorite.property);
            });
            Alert("success", message);
        } catch (err) {
            console.log(err);
        }
    }

    const propsObject = {
        isLoading,
        setIsLoading,
        token,
        setToken,
        user,
        setUser,
        favorites,
        setFavorites,
        newNotification,
        setNewNotification,
        addFavorite,
        removeFavorite,
        // Connections
        socket,
        setSocket,
        connectionStatus,
        setConnectionStatus,
    }

    return (
        <PropsContext.Provider value={propsObject}>
            { children }
        </PropsContext.Provider>
    )
};

export default PropsProvider;