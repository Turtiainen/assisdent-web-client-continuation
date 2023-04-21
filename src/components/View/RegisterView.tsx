import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getEntitiesForRegisterView } from '../../services/backend';
import { RegisterTable } from './RegisterTable';
import { DynamicObject } from '../../types/DynamicObject';
import { parseRegisterMetaView, parseOrderOptions } from '../../utils/Parser';

export type DataProps = {
    view: Element;
};

export const RegisterView = ({ view }: DataProps) => {
    const [fetchedEntities, setFetchedEntities] = useState<
        DynamicObject[] | null
    >(null);

    const EntityType = view.getAttribute('EntityType');
    const ViewName = view.getAttribute('Name');
    const ContextMenuElement = view.getElementsByTagName('ContextMenu').item(0);
    const ContextMenuItemsFormatted: {
        Text: string;
        Command: Element[];
    }[] = [];

    if (ContextMenuElement) {
        const ContextMenuItems = Array.from(ContextMenuElement.children);

        if (ContextMenuItems) {
            for (const elem of ContextMenuItems) {
                const Text = elem.getAttribute('Text');
                const Command = Array.from(elem.children);
                if (Text === null) continue;
                ContextMenuItemsFormatted.push({ Text, Command });
            }
        }
    }

    const orderBy = parseOrderOptions(view);
    const { columns, bindings } = parseRegisterMetaView(view);

    const searchOptions = {
        entityType: EntityType,
        viewName: ViewName,
        currentPage: 0,
        orderBy,
    };

    const mutation = useMutation({
        mutationFn: getEntitiesForRegisterView,
        onSuccess: (data) => {
            setFetchedEntities(data.Results);
        },
    });

    // Fetch data for register table
    // Mutate only once, when component renders
    useEffect(() => {
        mutation.mutate(searchOptions);
    }, []);

    return (
        <>
            {mutation.isLoading && (
                <h2 className="text-2xl px-8">Loading...</h2>
            )}
            {fetchedEntities && fetchedEntities.length > 0 && (
                <RegisterTable
                    columns={columns}
                    entities={fetchedEntities}
                    bindings={bindings}
                    entityType={EntityType}
                    contextMenu={ContextMenuItemsFormatted}
                />
            )}
            {fetchedEntities && fetchedEntities?.length < 1 && (
                <p className={`text-2xl px-8 py-4`}>No table data</p>
            )}
        </>
    );
};
