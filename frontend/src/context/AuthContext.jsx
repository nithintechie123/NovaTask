import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("velotask_token"), null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        if (token) {
            try {
                const res = await api.get("/user/me");
                setUser(res.data.user);
            } catch (err) {
                console.error("Session expired or invalid token", err);
                logout();
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await api.get("/user/me");
                    setUser(res.data.user);
                } catch (err) {
                    console.error("Session expired or invalid token", err);
                    logout();
                }
            }
            setLoading(false);
        }
        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        const res = await api.post("/user/login", { email, password });
        localStorage.setItem("velotask_token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const register = async (username, email, password) => {
        const res = await api.post("/user/register", { username, email, password });
        localStorage.setItem("velotask_token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    }

    const logout = () => {
        localStorage.removeItem("velotask_token");
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);