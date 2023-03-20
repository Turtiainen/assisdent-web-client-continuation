export type DropdownProps = {
    label: string;
    options: string[];

    // Optional props
    value?: string;
    disabled?: boolean;
    error?: string;
    placeholder?: string;
    className?: string;
    onChange: (value: string) => void;
};

function Dropdown(props: DropdownProps) {
    const {
        label,
        options,
        // Optional props
        onChange,
        disabled,
        placeholder,
        className,
        value,
        error,
    } = props;

    return (
        <div className={'flex w-full' + className}>
            <label className="text-left m-auto block w-1/2 text-sm font-medium text-gray-700">
                {label}
            </label>
            <select
                className="mt-1 block w-1/2  pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                value={value}
            >
                {placeholder && (
                    <option value={''} disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                    {error}
                </p>
            )}
        </div>
    );
}

export default Dropdown;
