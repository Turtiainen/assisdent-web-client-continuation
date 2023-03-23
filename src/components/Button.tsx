export type ButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
};

export default function Button(props: ButtonProps) {
    const { onClick, disabled } = props;
    console.log('Button disabled: ', disabled);

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ad-primary hover:bg-ad-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ad-primary-hover"
            data-testid="button"
        >
            {props.children}
        </button>
    );
}
