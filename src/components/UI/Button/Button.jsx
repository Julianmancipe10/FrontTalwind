import react from 'react';
import './Button.css';


const Button = ({ text , onclick, type= "button"}) => {
    return (
        <button 
        type={type}
        onClick={onClick}
        className='custom-button'
        >
         boton tales
        </button>
    );
};

export default Button;

