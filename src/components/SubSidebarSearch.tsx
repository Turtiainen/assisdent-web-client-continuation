export type SubSidebarSearchType = {
    onClick: () => void;
};

export const SubSidebarSearch = ({ onClick }: SubSidebarSearchType) => {
    // TODO: Add search functionality

    return (
        <div className="grid grid-cols-1 h-screen w-80 bg-gray-200 left-64 shadow-md">
            <div className="col-span-1">
                <div className="w-full inline-flex justify-between py-2">
                    <div className="px-2">Haku</div>
                    <button className="px-2" onClick={onClick}>
                        X
                    </button>
                </div>
                <div className="flex px-2">
                    <input
                        type="text"
                        className="w-full h-7 px-3 text-base placeholder-gray-600 border border-ad-grey-400 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none"
                        placeholder="Kirjoita hakusana 🔍"
                    />
                </div>
            </div>
            {/* TODO: Render search results here properly */}
            <div className="px-5">Hakutulokset</div>
            <div className="flex"></div>
        </div>
    );
};
