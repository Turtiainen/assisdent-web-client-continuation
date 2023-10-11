export interface SidebarItemType {
    text: string;
    icon: string;
    onClick?: () => void;
    isExpanded: boolean;
}

export const SidebarItem = ({
    text,
    icon,
    onClick,
    isExpanded,
}: SidebarItemType) => {
    return (
        <a
            className="grid grid-flow-col col-span-2 auto-cols-max hover:bg-white/25 h-10 items-center text-white hover:text-white"
            onClick={onClick}
            data-testid="sidebar-item"
        >
            <button><div className="mx-5 -mt-2.5 h-2 w-6"><img src={icon}/></div></button>
            {isExpanded ? (
                <button><div className="my-0 text-sm text-white w-full">{text}</div></button>
            ) : (
                ''
            )}
        </a>
    );
};
