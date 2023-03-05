import { useState } from 'react';

import { SidebarItems } from './SidebarItems';
import { SidebarFooter } from './SidebarFooter';
import {Link} from "react-router-dom";
import {ViewList} from "./View/ViewList";

export const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    const exampleSidebarItems = [
        {
            text: 'Valikko',
            icon: '🍔',
            onClick: () => console.log('Valikko'),
            isExpanded: isExpanded,
        },
        {
            text: 'Haku',
            icon: '🔍',
            onClick: () => console.log('Haku'),
            isExpanded: isExpanded,
        },
    ];

    const exampleSidebarSubContent = [
        {
            text: 'Matti Meikäläinen',
            icon: '👨‍💻',
            onClick: () => console.log('Matti Meikäläinen'),
            isExpanded: isExpanded,
        },
        {
            text: 'Tänään Xx x.x.xxxx',
            icon: '📅',
            onClick: () => console.log('Tänään Xx x.x.xxxx'),
            isExpanded: isExpanded,
        },
        {
            text: 'Keskeneräiset',
            icon: '0',
            onClick: () => console.log('Keskeneräiset'),
            isExpanded: isExpanded,
        },
        {
            text: 'Viestit ja kommentit',
            icon: '💬',
            onClick: () => console.log('Viestit ja kommentit'),
            isExpanded: isExpanded,
        },
        {
            text: 'Työjono',
            icon: '📝',
            onClick: () => console.log('Työjono'),
            isExpanded: isExpanded,
        },
        {
            text: 'Työtila',
            icon: '🏢',
            onClick: () => console.log('Työtila'),
            isExpanded: isExpanded,
        },
    ];

    return (
        <aside
            className={`min-h-[100vh] bg-ad-sidebar overflow-x-hidden overflow-y-auto transition-[width] ${
                isExpanded ? 'w-64' : 'w-14'
            }`}
        >
            <div className="flex">
                {isExpanded ? (
                    <Link
                        className="text-left mx-5 my-auto text-white hover:text-ad-subtitle w-2/3"
                        to="/"
                    >
                        AssisDent
                    </Link>
                ) : (
                    ''
                )}
                <button
                    className="font-medium bg-transparent text-white hover:text-ad-subtitle hover:border-transparent focus:border-transparent focus:outline-none w-1/3"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? '<=' : '=>'}
                </button>
            </div>
            <SidebarItems
                title=""
                content={exampleSidebarItems}
                isExpanded={isExpanded}
            />
            <ViewList className={`text-xs p-1 m-0`}/>
            <SidebarItems
                title="OMAT TIEDOT"
                content={exampleSidebarSubContent}
                isExpanded={isExpanded}
            />
            <SidebarFooter isExpanded={isExpanded} />
        </aside>
    );
};
