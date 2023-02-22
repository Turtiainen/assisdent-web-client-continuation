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
        >
            <div className="mx-4 -mt-4 h-2 w-6">{icon}</div>
            {isExpanded ? (
                <div className="my-0 text-sm text-white w-full">{text}</div>
            ) : (
                ''
            )}
        </a>
    );
};
