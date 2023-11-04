import { ChangeEvent, useState } from 'react';
import { DynamicObject } from '../../../types/DynamicObject';
import { InputRow } from '../../InputRow';
import { CheckboxLabeled } from '../../CheckboxLabeled';

export const BooleanInput = ({
    element,
    content,
    updateChangedTextInputValue,
}: {
    element: DynamicObject;
    content: string | DynamicObject | null | undefined;
    updateChangedTextInputValue: (
        valueString: string,
        key: string,
        value: string | number | boolean,
    ) => void;
}) => {
    const [checked, setChecked] = useState<boolean>(
        content?.toString() === 'true',
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setChecked(e.target.checked);
        updateChangedTextInputValue(
            element.attributes?.Value,
            element.attributes?.Identifier,
            e.target.checked,
        );
    };
    return (
        <InputRow>
            <CheckboxLabeled
                labelText={element.attributes.Caption}
                id={element.attributes.Identifier}
                type={`checkbox`}
                checked={checked}
                onChange={handleChange}
            />
        </InputRow>
    );
};
