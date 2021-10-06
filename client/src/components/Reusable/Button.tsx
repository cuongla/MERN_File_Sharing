import React, { FC } from 'react'

const Button: FC<{ text: string, onClick?: any, type?: "button" | "submit" | "reset" }> = ({ text, onClick, type }) => {
    return (
        <button
            onClick={onClick}
            className="bg-gray-900 p-2 my-5 rounded-md w-44 focus:ouline-none"
            type={type}>
            {text}
        </button>
    )
}

export default Button
