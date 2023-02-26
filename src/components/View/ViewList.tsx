import React from "react";
import {useQuery} from "@tanstack/react-query";
import {getRegisterViews} from "../../utils/Parser";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const ViewList: React.FC<{ selectDocument: (doc: HTMLElement) => void }> = ({
    selectDocument,
}) => {
    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ['getRegisterViews'],
        queryFn: async () => {
            return await getRegisterViews();
        },
    });

    let { viewid } = useParams();
    if (viewid) {
        const viewDocument = data?.find(
            (element) => element.documentElement.getAttribute('Name') == viewid,
        );
        if (viewDocument) selectDocument(viewDocument?.documentElement);
    }

    const registerViewNames = data?.map((doc: Document, idx: React.Key) => {
        const viewName = doc?.documentElement.getAttribute('Name');
        return (
            <li key={idx}>
                <Link to={`/view/${viewName}`}>{viewName}</Link>
            </li>
        );
    });

    const contentList = <ul>{registerViewNames}</ul>;
    const loadingSpinner = <p>Loading...</p>;

    return (
        <>
            {error && <p>There was an error while loading register views</p>}
            {isLoading && loadingSpinner}
            {data && data.length > 0 && contentList}
        </>
    );
};
