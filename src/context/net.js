"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const Context = createContext();

export const usePublic = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error("usePublic must be used within a PublicProvider");
    }
    return [context.net, context.setNet];
};

const PublicProvider = ({ children }) => {
    const [net, setNetState] = useState("public"); // Default value

    useEffect(() => {
        // Check if running on the client side before accessing localStorage

        const storedNet = localStorage.getItem("net");
        if (storedNet) {
            const segments = window.location.pathname.split('/');
            if (segments.includes('public')) {
                setNetState('public');
            } else if (segments.includes('testnet')) {
                setNetState('testnet');
            } else {
                setNetState(storedNet); // Initialize net state from localStorage if it exists
            }

        } else {
            const pathname = window.location.pathname.split('/');
            if (pathname.includes('public')) {
                setNetState('public');
                localStorage.setItem("net", 'public')
            } else if (pathname.includes('testnet')) {
                setNetState('testnet');
                localStorage.setItem("net", 'testnet')
            } else {
                setNetState('public')
                localStorage.setItem("net", 'public')

            }
        }
    }, []);

    const setNet = (newNet) => {
        setNetState(newNet);
        localStorage.setItem("net", newNet); // Persist net state to localStorage
    };

    const value = {
        net,
        setNet,
    };

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default PublicProvider;
