import React from 'react';

const Input = ({ type, placeholder, value, onchange, name }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onchange}
            name={name}
            className="w-full px-4 py-2.5 text-base transition duration-200 ease-in-out 
                     bg-white/10 border border-transparent rounded-lg
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none
                     placeholder:text-gray-400 text-white
                     hover:bg-white/[0.15]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     sm:text-sm md:text-base
                     shadow-sm"
        />
    );
};

export default Input;
