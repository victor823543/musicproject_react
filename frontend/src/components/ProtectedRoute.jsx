import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";


function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        const accessToken = localStorage.getItem(ACCESS_TOKEN)
        const url = new URL('http://localhost:8000/api/token/refresh/')

        const data = {refresh: refreshToken}

        const options = {
            method: 'POST',
            headers: {'Authorization': `Bearer ${accessToken}`},
            body: JSON.stringify(data)
        }

        fetch(url, options)
            .then(response => {
            if (response.ok) {
                response.json()
                .then(data => {
                    console.log(data)
                    localStorage.setItem(ACCESS_TOKEN, data.access)
                    setIsAuthorized(true)
                })
            } else {
                console.log(response)
                setIsAuthorized(false)
            }})
            .catch(error => console.error('Error', error))
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;