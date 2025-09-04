import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Loader from "./Loader";

function ProtectedRoute({ children, isLoading, user }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/')
        }
    }, [isLoading, navigate, user])

    if (isLoading) return <Loader />

    return user? children: null;
}

export default ProtectedRoute;