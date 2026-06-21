import { createContext, useState } from "react";
// import { useEffect } from "react";
// import { getMe } from "./services/auth.api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // true in production, false in development

    // we have to take out the fact that refreshing doesn't consider the login we did for new user (chrome)
    // it is not considering the login but cookies will save it
    // (moved to hooks/useAuth)

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
