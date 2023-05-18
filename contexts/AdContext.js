import React, { createContext, useState, useEffect, useContext } from "react"

// Create the context
const AdContext = React.createContext({
    adImage: "/default-image.jpg",
    adText: "Loading...",
})

// Create a custom hook that allows easy access to our context
export const useAdContext = () => {
    return useContext(AdContext)
}

// This component is the provider that wraps around components that need access to the ad context
// AdContext.js
export const AdProvider = ({ children }) => {
    // Get the adImage and adText from localStorage, or use default values if they're not set
    const [adImage, setAdImage] = useState(() => localStorage.getItem("adImage") || "")
    const [adText, setAdText] = useState(() => localStorage.getItem("adText") || "")

    useEffect(() => {
        // Whenever adImage or adText change, update them in localStorage
        localStorage.setItem("adImage", adImage)
        localStorage.setItem("adText", adText)
    }, [adImage, adText])

    return (
        <AdContext.Provider value={{ adImage, setAdImage, adText, setAdText }}>
            {children}
        </AdContext.Provider>
    )
}
