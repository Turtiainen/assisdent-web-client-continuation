import React, { useEffect, useState } from 'react';

export const ViewHeader = ({
    header,
    subHeader,
}: {
    header: string;
    subHeader?: string;
}) => {
    const [scrollYPosition, setScrollYPosition] = useState<number>();

    const handleScroll = () => {
        setScrollYPosition(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header
            className={`z-10 w-full bg-white ${
                scrollYPosition ? 'py-2 drop-shadow-md' : 'py-8'
            } px-8 mb-4 sticky top-0 transition-[padding_drop-shadow] duration-300 ease-out ${
                scrollYPosition && subHeader ? 'flex items-center' : ''
            }`}
        >
            <h1
                className={`${
                    scrollYPosition ? 'text-xl' : 'text-3xl'
                } text-ad-hero-title origin-left font-medium transition-[font-size] duration-300 ease-in-out flex-initial`}
            >
                {header}
            </h1>

            <h2
                className={`text-ad-grey-600 font-semibold ${
                    scrollYPosition !== undefined &&
                    scrollYPosition > 0 &&
                    'ml-2'
                }`}
            >
                {scrollYPosition !== undefined &&
                    scrollYPosition > 0 &&
                    subHeader &&
                    '-'}{' '}
                {subHeader}
            </h2>
        </header>
    );
};
