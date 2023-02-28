interface SidebarFooterProps {
    isExpanded: boolean;
}

export const SidebarFooter = ({ isExpanded }: SidebarFooterProps) => {
    return (
        <div
            className={`absolute bottom-0 ${
                isExpanded ? 'm-5 space-x-4' : 'm-1'
            }
            `}
        >
            {isExpanded ? (
                <>
                    <button className="h-2 w-2 text-white items-center bg-transparent hover:text-ad-subtitle hover:border-transparent focus:border-transparent focus:outline-none">
                        ?
                    </button>
                    <button className="h-2 w-2 text-white items-center bg-transparent hover:text-ad-subtitle hover:border-transparent focus:border-transparent focus:outline-none">
                        S
                    </button>
                    <button className="h-2 w-2 text-white items-center bg-transparent hover:text-ad-subtitle hover:border-transparent focus:border-transparent focus:outline-none">
                        A
                    </button>
                    <button className="h-2 w-2 text-white items-center bg-transparent hover:text-ad-subtitle hover:border-transparent focus:border-transparent focus:outline-none">
                        Ô
                    </button>
                </>
            ) : (
                <button className="text-white items-center bg-transparent hover:text-ad-subtitle hover:border-transparent focus:border-transparent focus:outline-none">
                    +
                </button>
            )}
        </div>
    );
};
