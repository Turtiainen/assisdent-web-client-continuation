import {
    assisdentMenuImage,
    helpMenuImage,
    powerMenuImage,
    settingsMenuImage,
    moreMenuImage,
} from '../assets/ExportImages'

interface SidebarFooterProps {
    isExpanded: boolean;
}

export const SidebarFooter = ({ isExpanded }: SidebarFooterProps) => {
    return (
        <div
            className={`absolute bottom-0 ${isExpanded ? 'm-7 space-x-6' : 'm-4'
                }
            `}
            data-testid="sidebar-footer"
        >
            {isExpanded ? (
                <>
                    <button><div className="h-4 w-7"><img src={helpMenuImage} /></div></button>
                    <button><div className="h-4 w-7"><img src={settingsMenuImage} /></div></button>
                    <button><div className="h-4 w-7"><img src={assisdentMenuImage} /></div></button>
                    <button><div className="h-4 w-7"><img src={powerMenuImage} /></div></button>
                </>
            ) : (
                <button><div className="h-4 w-7"><img src={moreMenuImage} /></div></button>
            )}
        </div>
    );
};
