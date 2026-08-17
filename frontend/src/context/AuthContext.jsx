import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(
        localStorage.getItem("access") ? true : null
    );

    const login = async (username, password) => {
        const response = await api.post("/token/", {
            username,
            password,
        });

        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);

        setUser(true);
    };

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}