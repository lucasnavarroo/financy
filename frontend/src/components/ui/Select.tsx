import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    helperText?: string;
    error?: boolean;
    leftIcon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
    className = '',
    label,
    helperText,
    error,
    leftIcon,
    id,
    children,
    ...props
}, ref) => {
    const selectId = id || Math.random().toString(36).substring(7);

    return (
        <div className={`input-group ${className}`}>
            {label && <label className="input-label" htmlFor={selectId}>{label}</label>}

            <div className="input-wrapper">
                {leftIcon && <div className="input-icon-left">{leftIcon}</div>}
                <select
                    ref={ref}
                    id={selectId}
                    className={`input-field ${error ? 'error' : ''} ${leftIcon ? 'input-field-with-icon-left' : ''} input-field-with-icon-right`}
                    style={{ appearance: 'none' }}
                    {...props}
                >
                    {children}
                </select>
                <div className="input-icon-right" style={{ pointerEvents: 'none' }}>
                    <ChevronDown size={18} />
                </div>
            </div>

            {helperText && (
                <p className={`input-helper ${error ? 'error' : ''}`}>{helperText}</p>
            )}
        </div>
    );
});
Select.displayName = 'Select';
