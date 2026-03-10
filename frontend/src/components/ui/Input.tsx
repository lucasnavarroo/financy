import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconClick?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    className = '',
    label,
    helperText,
    error,
    leftIcon,
    rightIcon,
    onRightIconClick,
    id,
    ...props
}, ref) => {
    const inputId = id || Math.random().toString(36).substring(7);

    return (
        <div className={`input-group ${className}`}>
            {label && <label className="input-label" htmlFor={inputId}>{label}</label>}

            <div className="input-wrapper">
                {leftIcon && <div className="input-icon-left">{leftIcon}</div>}
                <input
                    ref={ref}
                    id={inputId}
                    className={`input-field ${error ? 'error' : ''} ${leftIcon ? 'input-field-with-icon-left' : ''} ${rightIcon ? 'input-field-with-icon-right' : ''}`}
                    {...props}
                />
                {rightIcon && (
                    <button
                        type="button"
                        className="input-icon-right"
                        onClick={onRightIconClick}
                        disabled={props.disabled}
                    >
                        {rightIcon}
                    </button>
                )}
            </div>

            {helperText && (
                <p className={`input-helper ${error ? 'error' : ''}`}>{helperText}</p>
            )}
        </div>
    );
});
Input.displayName = 'Input';
