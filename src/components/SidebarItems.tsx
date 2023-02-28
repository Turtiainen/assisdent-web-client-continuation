import { SidebarItem, SidebarItemType } from './SidebarItem';

export interface SidebarItemsType {
    title: string;
    content: SidebarItemType[];
    isExpanded: boolean;
}

export const SidebarItems = ({
    title,
    content,
    isExpanded,
}: SidebarItemsType) => {
    return (
        <div>
            {title && title.length > 0 ? (
                <h4
                    className={`mb-2 ml-2 text-left text-ad-subtitle overflow-hidden after:h-[1px] after:bg-ad-subtitle after:inline-flex after:align-middle ${
                        isExpanded
                            ? 'after:w-3/6 after:ml-1 pt-2'
                            : 'after:w-full after:ml-0 pt-2'
                    }`}
                >
                    {isExpanded ? title : ''}
                </h4>
            ) : (
                ''
            )}
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
    );
};
