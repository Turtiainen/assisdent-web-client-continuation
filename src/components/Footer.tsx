type footerProps = {
    children: React.ReactNode;
};

export const Footer = (props: footerProps) => {
    return (
        <div
            className={`toolbar bg-white border-t-2 border-ad-blue-600 flex justify-between fixed bottom-px px-4 w-full`}
        >
            <div className={`page-actions`}>
                <span>{props.children}</span>
            </div>
            <div className="current-page"></div>
            <div className="windows-actions"></div>
        </div>
    );
};
