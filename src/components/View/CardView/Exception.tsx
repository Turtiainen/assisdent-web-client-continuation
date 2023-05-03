import { DynamicObject } from '../../../types/DynamicObject';
import { TranslationList } from './TranslationList';

export const Exception = ({
    element,
    content,
}: {
    element: DynamicObject;
    content: string | DynamicObject | null | undefined;
}) => {
    if (!Array.isArray(content) || content.length === 0) return null;

    return (
        <div className={`basis-full my-8 col-span-2 [column-span:all]`}>
            <h2 className={`text-lg mb-2 uppercase text-ad-grey-700`}>
                {element.attributes.Caption}
            </h2>
            <TranslationList translations={content} />
        </div>
    );
};
