"use client"
import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';

interface AuthProps {
    authState: {
        token: string | null;
        authenticated: boolean | null;
    };
    onRegister: (email: string, password: string, gender: string, goal: string, bodyType: string, age: number, weight: number, height: number, activityLevel: string, bmi: number) => Promise<void>;
    onCheckRegister: (email: string, password: string) => Promise<any>;
    onLogin: (email: string, password: string) => Promise<void>;
    onLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthProps>({
    authState: {
        token: null,
        authenticated: null,
    },
    onRegister: async () => {},
    onCheckRegister: async () => {},
    onLogin: async () => {},
    onLogout: async () => {},
});

export const useAuth = () => {
    return useContext(AuthContext);
};

const API_URL_login = 'http://192.168.56.1:3007/fyp/users/signin';
const API_URL_Register = 'http://192.168.56.1:3007/fyp/users/signup';
const API_URL_Register_check = 'http://192.168.56.1:3007/fyp/users/check-email/';
const TOKEN_KEY = 'abcd123';

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null,
    });



    useEffect(() => {
        const loadTokenAndRole = async () => {
            const token = localStorage.getItem(TOKEN_KEY);

            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setAuthState({
                    token: token,
                    authenticated: true,
                });
            } else {
                setAuthState({
                    token: null,
                    authenticated: false,
                });
            }
        };

        loadTokenAndRole();
    }, []);

    const register = async (
        email: string,
        password: string,
        gender: string,
        goal: string,
        bodyType: string,
        age: number,
        weight: number,
        height: number,
        activityLevel: string,
        bmi: number
    ) => {
        try {
            const response = await fetch(API_URL_Register, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    gender,
                    goal,
                    bodyType,
                    age,
                    weight,
                    height,
                    activityLevel,
                    bmi,
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                console.log(errorMessage);
                throw new Error(errorMessage.message || "Registration failed");
            }

            const result = await response.json();

            setAuthState({
                token: result.token,
                authenticated: true,
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;

           // localStorage.setItem(TOKEN_KEY, result.token);
        } catch (error) {
            console.error("An error occurred:", error);
            throw error;
        }
    };

    const checkRegister = async (email: string, password: string) => {
        const api = API_URL_Register_check + email;
        try {
            const response = await fetch(api, {
                method: 'GET',
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                return { error: true, msg: errorMessage.msg };
            } else {
                return await response.json();
            }
        } catch (e) {
            console.error("An error occurred while checking registration:", e);
            return { error: true, msg: 'An error occurred while checking registration.' };
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(API_URL_login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            setAuthState({
                token: result.token,
                authenticated: true,
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;

            localStorage.setItem(TOKEN_KEY, result.token);
            Cookies.set(TOKEN_KEY, result.token);
        } catch (error) {
            console.error("An error occurred while logging in:", error);
            throw error;
        }
    };

    const logout = async () => {
        localStorage.removeItem(TOKEN_KEY);

        axios.defaults.headers.common['Authorization'] = '';
        setAuthState({
            token: null,
            authenticated: false,
        });

       console.log("/") // Use router for navigation in Next.js
    };

    const value = {
        authState,
        onRegister: register,
        onCheckRegister: checkRegister,
        onLogin: login,
        onLogout: logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
