import { Key, useState } from 'react';
import { DynamicObject } from '../../../types/DynamicObject';

type EditorProps = {
    element: DynamicObject;
    content: string | undefined;
    placeholder: string | undefined;
};

export const Editor = (props: EditorProps) => {
    const { element, content, placeholder } = props;
    const [value, setValue] = useState<string | undefined>(content);
    return (
        <div
            key={element.attributes['__id'] as Key}
            className="flex flex-col lg:flex-row lg:gap-32"
        >
            <label
                htmlFor={element.attributes.Identifier}
                className={`text-base font-semibold text-ad-grey-800 flex items-center lg:w-1/4`}
            >
                {element.attributes.Caption}
            </label>
            <textarea
                id={element.attributes.Identifier}
                placeholder={placeholder?.toString()}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`flex-1 border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
            />
        </div>
    );
};
