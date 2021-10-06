import React from 'react'

const Button = ({ text, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-gray-900 p-2 my-5 rounded-md w-44 focus:ouline-none">
            {text}
        </button>
    )
}

export default Button
