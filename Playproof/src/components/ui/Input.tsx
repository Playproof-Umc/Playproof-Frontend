import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
    return (
        <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
        <input
            className={`w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white 
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors
            placeholder-gray-500 ${error ? 'border-red-500' : ''} ${className}`}
            {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
        </div>
    );
};