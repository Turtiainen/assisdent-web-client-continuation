import { ChangeEvent, useState } from 'react';
import { DynamicObject } from '../../../types/DynamicObject';
import { InputRow } from '../../InputRow';
import { CheckboxLabeled } from '../../CheckboxLabeled';
import { Input } from '../../Input';

export const BooleanInput = ({
    element,
    content,
}: {
    element: DynamicObject;
    content: string | DynamicObject | null | undefined;
}) => {
    const [checked, setChecked] = useState<boolean>(
        content?.toString() === 'true',
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setChecked(!checked);
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
