import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
    tinyUpMenuImage,
    tinyDownMenuImage,
    tinyRightMenuImage,
} from '../assets/ExportImages';

type MenuItemProps = {
    text: string;
    onClick: () => void;
    linkTo?: string;
};

export const MenuItem = ({ text, linkTo = '', onClick }: MenuItemProps) => (
    <li onClick={onClick}>
        <Link to={linkTo}>{text}</Link>
        <img
            src={tinyRightMenuImage}
            className="inline-flex h-2.5 w-5"
            alt="Right Icon"
        />
    </li>
);

type SectionProps = {
    title: string;
    items: MenuItemProps[];
    onClick: () => void;
};

export const MenuSection = ({ title, items, onClick }: SectionProps) => {
    const [showList, setShowList] = useState(false);

    const toggleList = () => {
        setShowList(!showList);
    };

    return (
        <div>
            <div className="flex items-center my-5">
                <h4 className="flex-none mr-2 cursor-pointer" onClick={onClick}>
                    {title}
                </h4>
                <div className="flex-grow h-[1px] bg-black"></div>
                <span onClick={toggleList} className="cursor-pointer">
                    {showList ? (
                        <img
                            src={tinyUpMenuImage}
                            className="h-3 w-6"
                            alt="Up Icon"
                        />
                    ) : (
                        <img
                            src={tinyDownMenuImage}
                            className="h-3 w-6"
                            alt="Down Icon"
                        />
                    )}
                </span>
            </div>

            {showList && (
                <ul className="w-80 pt-3 pr-4 cursor-pointer text-blue-500">
                    {items.map((item, index) => (
                        <MenuItem key={index} {...item} />
                    ))}
                </ul>
            )}
        </div>
    );
};
