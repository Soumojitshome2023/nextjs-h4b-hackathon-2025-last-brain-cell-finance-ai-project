"use client";
// ======================== Imports ========================
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@civic/auth/react";
import SaveUserDataFunc from "./SaveUserDataFunc";
import GetUserDataFunc from "./GetUserDataFunc";

// ======================== Create Context ========================
const AuthUserContext = createContext();

export function useRajAuth() {
    const { user } = useUser();
    const [LoggedInUserData, setLoggedInUserData] = useState(null);
    const [FirstLoader, setFirstLoader] = useState(true);


    useEffect(() => {
        setFirstLoader(true);
        if (user) {
            const syncUserData = async () => {
                try {
                    // 1. Try to fetch existing user data
                    const existingUser = await GetUserDataFunc(user.email);

                    if (existingUser) {
                        // Set local state with existing user data
                        setLoggedInUserData(existingUser);
                    } else {
                        // 2. If user doesn't exist, create default data
                        const newUserData = {
                            name: user.name,
                            picture: user.picture,
                            email: user.email,
                            annualIncome: 20000,
                            riskTolerance: 'Medium' // Ensure it matches the enum ["Low", "Medium", "High"]
                        };

                        const savedUser = await SaveUserDataFunc(newUserData);
                        setLoggedInUserData(savedUser);
                    }
                } catch (error) {
                    console.error('Error syncing user data:', error.message);
                }
                finally {
                    setFirstLoader(false);
                }
            };

            syncUserData();
        }
        else {
            setLoggedInUserData(null);
            setFirstLoader(false);
        }
    }, [user]);


    // ======================== Return ========================
    return {
        LoggedInUserData, setLoggedInUserData,
        FirstLoader, setFirstLoader

    };
}

// ======================== Auth Provider ========================
export const AuthUserProvider = ({ children }) => {
    const auth = useRajAuth();
    return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>;
};

export const useAuth = () => useContext(AuthUserContext);
