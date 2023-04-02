import React, { ChangeEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { sortByDocumentHeader } from '../../utils/sortingUtils';
import { getRegisterViewsFromSchema } from '../../utils/Parser';
import useSchemaStore from '../../store/store';
import { useEffect, useState } from 'react';
import { SchemaStore } from '../../types/SchemaStore';

export const ViewList = ({ className }: { className?: string }) => {
    const navigate = useNavigate();
    const [registerViews, setRegisterViews] = useState<Document[]>([]);
    const schemaInStore = useSchemaStore((state: SchemaStore) => state.schema);

    const handleOnChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
        evt.preventDefault();
        navigate(`view/${evt.target.value}`);
    };

    useEffect(() => {
        setRegisterViews(getRegisterViewsFromSchema(schemaInStore));
    }, [schemaInStore]);

    const registerViewNames = registerViews
        ?.sort(sortByDocumentHeader)
        .map((doc: Document) => {
            const docName = doc.documentElement.getAttribute('Name')!;
            const header =
                doc.documentElement.getAttribute('Header') || docName;

            return (
                <option key={docName} value={docName}>
                    {header}
                </option>
            );
        });

    return (
        <div className={`px-8 py-4`}>
            {registerViewNames?.length !== 0 ? (
                <select
                    className={`border-2 border-slate-200 hover:border-blue-400 cursor-pointer rounded p-2 ${className}`}
                    onChange={handleOnChange}
                >
                    {registerViewNames}
                </select>
            ) : (
                <p>Loading view names...</p>
            )}
        </div>
    );
};
