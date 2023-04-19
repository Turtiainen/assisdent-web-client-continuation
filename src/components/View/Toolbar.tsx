import { ShowOnPage } from './ShowOnPage';
import { ShowOnPageOption } from '../../utils/constants';

type ToolbarProps = {
    isSelectedShowOnPage: (num: ShowOnPageOption) => boolean;
    handleSelectShowOnPage: (num: ShowOnPageOption) => void;
    filteredTotalCount: number;
};

export const Toolbar = ({
    isSelectedShowOnPage,
    handleSelectShowOnPage,
    filteredTotalCount,
}: ToolbarProps) => {
    return (
        <div
            className={`flex justify-between mb-2 px-8 items-center text-sm font-semibold`}
        >
            <div className={`flex gap-8`}>
                <button className={`hover:text-ad-primary`}>
                    Näytä tarkemmat hakuehdot ⬇️
                </button>
                {filteredTotalCount > 0 && (
                    <p className={`text-ad-grey-500`}>
                        Yhteensä {filteredTotalCount}
                    </p>
                )}
            </div>
            <div className={`flex justify-end gap-12 items-center `}>
                <button
                    className={`cursor-pointer py-1 px-2 hover:text-ad-primary`}
                >
                    🔃 Järjestä
                </button>
                <ShowOnPage
                    isSelected={isSelectedShowOnPage}
                    handleSelect={handleSelectShowOnPage}
                />
            </div>
        </div>
    );
};
