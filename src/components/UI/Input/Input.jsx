import React from 'react';
import './Input.css';

const Input =({ type , placeholder, value, onchange, name}) => {
    return (
        <input
         type={type}
         placeholder={placeholder}
         value= {value}
         onchange={onchange}
         name={name}
         className="custom-input"

       />
    );
};


export default Input;
