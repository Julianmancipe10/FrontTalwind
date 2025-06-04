import React from 'react';

const Button = ({ text, onClick, type = "button", variant = "primary", size = "md", fullWidth = false }) => {
    const baseStyles = "font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
        success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg"
    };

    const widthClass = fullWidth ? "w-full" : "w-auto";

    return (
        <button 
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {text}
        </button>
    );
};

export default Button;

