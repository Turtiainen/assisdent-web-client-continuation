export interface SidebarItemType {
    text: string;
    icon: string;
    onClick?: () => void;
    isExpanded: boolean;
}

export const SidebarItem = ({ 
    text, icon, onClick, isExpanded 
}: SidebarItemType ) => {
    return (
        <div className="sidebar-item" onClick={onClick}>
            <a>
                <div className="sidebar-item-block">{icon}</div>
                {isExpanded ? <div className="sidebar-item-block">{text}</div> : ""}
            </a>
        </div>
    )
}