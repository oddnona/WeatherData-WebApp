import React from "react";
import GifSunAnimation from "./GifAnimation2";



const StartPage = () => {
    return (
        <div>
            <h1>Weather API</h1>
            <GifSunAnimation isAnimating={true} />
            <h3 style={{ fontSize: "1.5em", fontWeight: "normal" }}>Welcome! Please press one of the above buttons to continue.
            </h3>
        </div>
    );
};
export default StartPage;