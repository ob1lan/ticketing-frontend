import React, { useEffect, useState } from "react";

const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave",
    "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua",
    "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk",
    "autumn", "business", "acid", "lemonade", "night", "coffee", "winter",
];

const ThemeSelector = () => {
    const [selectedTheme, setSelectedTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    const handleThemeChange = (theme) => {
        setSelectedTheme(theme);
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", selectedTheme);
    }, [selectedTheme]);

    return (
        <div className="form-control">
            <label className="fieldset-label">
                <span className="label-text">Select Theme</span>
            </label>
            <select
                className="select select-bordered w-full"
                value={selectedTheme}
                onChange={(e) => handleThemeChange(e.target.value)}
            >
                {themes.map((theme) => (
                    <option key={theme} value={theme}>
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ThemeSelector;
