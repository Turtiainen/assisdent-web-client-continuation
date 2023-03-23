import { DynamicObject } from '../../../types/DynamicObject';

export const DateInput = ({
    element,
    content,
}: {
    element: DynamicObject;
    content: string | DynamicObject;
}) => {
    return (
        <div className={`flex flex-col lg:flex-row lg:gap-32`}>
            <label
                htmlFor={element.attributes.Identifier}
                className={`text-sm font-semibold text-ad-grey-800 flex items-center lg:w-1/4`}
            >
                {element.attributes.Caption}
            </label>
            <input
                id={element.attributes.Identifier}
                type={`text`}
                defaultValue={new Date(content.toString()).toLocaleString(
                    'fi-FI',
                    {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                    },
                )}
                className={`flex-1 max-h-12 border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
            />
        </div>
    );
};
