import React, { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        console.log("Socket Conneting......")
        const newsocket = io(import.meta.env.VITE_API_URL_SOCKET, {
            transports: ["websocket"],
            reconnection: true
        });
        console.log("Socket Conneting Again......", newsocket)
        setSocket(newsocket);

        return () => {
            newsocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
