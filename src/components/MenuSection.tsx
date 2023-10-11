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
    button?: JSX.Element;
    onClick: () => void;
};

export const MenuSection = ({
    title,
    items,
    onClick,
    button,
}: SectionProps) => {
    const [showList, setShowList] = useState(false);

    const toggleList = () => {
        setShowList(!showList);
    };

    return (
        <div>
            <div className="flex items-center my-3">
                <h4
                    className="flex-none mr-2 cursor-pointer"
                    onClick={() => {
                        toggleList();
                        onClick();
                    }}
                >
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
                <div>
                    <ul className="w-80 pr-4 cursor-pointer text-blue-500 mb-3">
                        {items.map((item, index) => (
                            <MenuItem key={index} {...item} />
                        ))}
                    </ul>
                    {button}
                </div>
            )}
        </div>
    );
};
