import {
    ReactElement,
    JSXElementConstructor,
    ReactFragment,
    ReactPortal,
} from 'react';

type badgeProps = {
    isInactive?: boolean;
    children: React.ReactNode;
};

export const Badge = (props: badgeProps) => {
    return (
        <span className={`${props.isInactive ? 'bg-ad-grey-400 hover:bg-ad-grey-200' : 
        'text-white bg-ad-primary hover:bg-ad-primary-hover active:bg-ad-primary-pressed'} p-1 rounded-full w-6 h-6 inline-block text-xs text-center`}>
            {props.children}
        </span>
    );
};
