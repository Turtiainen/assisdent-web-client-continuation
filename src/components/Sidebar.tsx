import { useState, useEffect } from 'react';

import { SidebarItems } from './SidebarItems';
import { SidebarFooter } from './SidebarFooter';
import { Link } from 'react-router-dom';
import { SubSidebarSearch } from './SubSidebarSearch';
import { Menu } from './Menu';

import {
    calendarMenuImage,
    menuCloseMenuImage,
    draftMenuImage,
    menuMenuImage,
    messagesMenuImage,
    officeMenuImage,
    menuOpenMenuImage,
    searchMenuImage,
    userMenuImage,
    workQueueMenuImage,
} from '../assets/ExportImages';

//TODO: check if schema sends date and fix
const today = new Date();
const month = today.getMonth() + 1;
const year = today.getFullYear();
const date = today.getDate();
const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

export const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [subSidebar, setSubSidebar] = useState<null | JSX.Element>(null);

    useEffect(() => {
        setIsExpanded(!isExpanded);
    }, [subSidebar]);

    const exampleSidebarItems = [
        {
            text: 'Valikko',
            icon: menuMenuImage,
            onClick: () =>
                setSubSidebar(<Menu onClick={() => setSubSidebar(null)} />),
            isExpanded: isExpanded,
        },
        {
            text: 'Haku',
            icon: searchMenuImage,
            onClick: () =>
                setSubSidebar(
                    subSidebar ? null : (
                        <SubSidebarSearch onClick={() => setSubSidebar(null)} />
                    ),
                ),
            isExpanded: isExpanded,
        },
    ];

    const exampleSidebarSubContent = [
        {
            text: 'Matti Meikäläinen',
            icon: userMenuImage,
            onClick: () => console.log('Matti Meikäläinen'),
            isExpanded: isExpanded,
        },
        {
            text:
                'Tänään ' +
                weekday[today.getDay()] +
                ' ' +
                date +
                '/' +
                month +
                '/' +
                year,
            icon: calendarMenuImage,
            onClick: () => console.log('Tänään'),
            isExpanded: isExpanded,
        },
        {
            text: 'Keskeneräiset',
            icon: draftMenuImage,
            onClick: () => console.log('Keskeneräiset'),
            isExpanded: isExpanded,
        },
        {
            text: 'Viestit ja kommentit',
            icon: messagesMenuImage,
            onClick: () => console.log('Viestit ja kommentit'),
            isExpanded: isExpanded,
        },
        {
            text: 'Työjono',
            icon: workQueueMenuImage,
            onClick: () => console.log('Työjono'),
            isExpanded: isExpanded,
        },
        {
            text: 'Työtila',
            icon: officeMenuImage,
            onClick: () => console.log('Työtila'),
            isExpanded: isExpanded,
        },
    ];

    return (
        <>
            <aside
                className={`min-h-[100vh] max-h-screen bg-ad-sidebar overflow-x-hidden overflow-y-auto transition-[width] sticky relative left-0 bottom-0 top-0 ${
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
                        {isExpanded ? (
                            <div className="mx-4 -mt-2 h-2 w-6">
                                <img src={menuCloseMenuImage} />
                            </div>
                        ) : (
                            <div className="mx-6 mt-4 h-8 w-6">
                                <img src={menuOpenMenuImage} />
                            </div>
                        )}
                    </button>
                </div>
                <SidebarItems
                    title=""
                    content={exampleSidebarItems}
                    isExpanded={isExpanded}
                />
                <SidebarItems
                    title="OMAT TIEDOT"
                    content={exampleSidebarSubContent}
                    isExpanded={isExpanded}
                />
                <SidebarFooter isExpanded={isExpanded} />
            </aside>
            {subSidebar}
        </>
    );
};
