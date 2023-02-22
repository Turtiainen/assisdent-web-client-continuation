import { useState } from 'react';

export type CheckboxProps = {
    // optional props
    labelSide?: 'left' | 'right';
    label?: string;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
};

export const Checkbox = (props: CheckboxProps) => {
    const {
        // optional props
        labelSide,
        checked,
        label,
        onChange,
        disabled,
    } = props;
    const [isChecked, setChecked] = useState<boolean>(
        checked ? checked : false,
    );

    const labelComponent = label ? (
        <span
            className={`text-${labelSide} align-bottom m-auto text-lg font-medium text-gray-700`}
        >
            {label}
        </span>
    ) : null;

    return (
        <div className="space-x-8 align-center">
            {label && labelSide === 'left' ? labelComponent : null}
            <input
                type="checkbox"
                className={`checkbox w-4 h-4`}
                checked={isChecked}
                onChange={onChange ? onChange : () => setChecked(!isChecked)}
                disabled={disabled ? disabled : false}
            />
            {label && labelSide === 'right' ? labelComponent : null}
        </div>
    );
};
