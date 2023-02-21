export type InputProps = {
    label: string;
    placeholder?: string;
    className?: string;

    onChange?: (value: string) => void;
    error?: string;
};

function Input(props: InputProps) {
    const { className, label, onChange, error } = props;

    return (
        <div className={'flex w-full' + className}>
            <label className="text-left m-auto block w-1/2 text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                className="mt-1 block w-1/2  pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={onChange && ((e) => onChange(e.target.value))}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export default Input;
