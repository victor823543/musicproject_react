import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

const useAuthentication = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('')

    
        const checkAuthentication =  async () => {
        try {
            // Check if access token exists in local storage
            const accessToken = localStorage.getItem(ACCESS_TOKEN)
            if (!accessToken) {
                setIsAuthenticated(false)
                setLoading(false)
                return
            }

            // Check if access token is expired
            let decodedToken = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp > currentTime) {
                console.log(decodedToken)
                setIsAuthenticated(true);
                setUsername(decodedToken.username)
                setLoading(false);
                return;
            }

            // Access token expired, attempt to refresh it
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
            if (!refreshToken) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }
            console.log(refreshToken)
            const content = {refresh: refreshToken}
            const response = await fetch('http://localhost:8000/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify(content),
            });

            if (!response.ok) {
            // Refresh token failed, user is not authenticated
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            const data = await response.json();
            localStorage.setItem(ACCESS_TOKEN, data.access);
            decodedToken = jwtDecode(data.access)
            setIsAuthenticated(true);
            setUsername(decodedToken.username)
            setLoading(false);
        } catch (error) {
            console.error('Error checking authentication:', error);
            setIsAuthenticated(false);
            setLoading(false);
        }};
        
        useEffect(() => {
            checkAuthentication();
        }, [])

        const refreshAuthentication = () => {
            checkAuthentication();
        };

    return (
        {isAuthenticated, loading, username, refreshAuthentication}
    )
}

export default useAuthentication