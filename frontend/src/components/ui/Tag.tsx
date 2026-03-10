import React from 'react';

export type TagColor = 'gray' | 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow' | 'green';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
    color?: TagColor;
    children: React.ReactNode;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(({
    className = '',
    color = 'gray',
    children,
    ...props
}, ref) => {
    return (
        <span
            ref={ref}
            className={`tag ${color} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
});
Tag.displayName = 'Tag';
