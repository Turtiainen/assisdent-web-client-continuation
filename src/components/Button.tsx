export type ButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
};

export default function Button(props: ButtonProps) {
    const { onClick } = props;

    return (
        <button
            onClick={onClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            {props.children}
        </button>
    );
}
