import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    className = '',
    variant = 'primary',
    size = 'md',
    icon,
    children,
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            className={`btn btn-${variant} btn-${size} ${className}`}
            {...props}
        >
            {icon}
            {children}
        </button>
    );
});
Button.displayName = 'Button';
