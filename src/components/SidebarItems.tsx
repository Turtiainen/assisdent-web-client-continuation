import { SidebarItem, SidebarItemType } from "./SidebarItem";

export interface SidebarItemsType {
    title: string;
    content: SidebarItemType[];
    isExpanded: boolean;
}

export const SidebarItems = ({ title, content, isExpanded }: SidebarItemsType) => {
    return (
        <div className="sidebar-item-container">
            {title && title.length > 0
                ? <h4>{isExpanded ? title : ""}</h4> 
                : ""}
            {content.map((item) => (
                <SidebarItem
                    key={item.text}
                    text={item.text}
                    icon={item.icon}
                    onClick={item.onClick}
                    isExpanded={isExpanded}
                />
            ))}
        </div>
    )
}