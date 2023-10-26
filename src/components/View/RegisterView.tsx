import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getEntitiesForRegisterView } from '../../services/backend';
import { RegisterTable } from './RegisterTable';
import { DynamicObject } from '../../types/DynamicObject';
import { parseOrderOptions, parseRegisterMetaView } from '../../utils/Parser';
import { getUserLanguage } from '../../utils/utils';
import { DEFAULT_SHOW_ON_PAGE, ShowOnPageOption } from '../../utils/constants';
import { Toolbar } from './Toolbar';
import {
    OrderBy,
    OrderOptionNameObject,
} from '../../types/ViewTypes/OrderOptions';
import { getEntitySchema } from '../../temp/SchemaUtils';
import { LoadingSpinner } from '../LoadingSpinner';

export type DataProps = {
    view: Element;
};

type EntitySearchOptionsType = {
    EntityType: string;
    Skip: number;
    Take: number;
    Filters?: object;
    SubArgs?: object;
    OrderBy: OrderOptionNameObject[] | null;
    PropertiesToSelect: string[];
    IgnoreCalculatedProperties?: boolean;
    SearchLanguage?: string;
    Purpose: string;
    PurposeArgs: {
        ViewName: string;
    };
    IncludeUnfilteredTotalCount?: boolean;
    IncludeFilteredTotalCount?: boolean;
    MissingPropertyIsError?: boolean;
};

export const RegisterView = ({ view }: DataProps) => {
    /**
     * Use State
     */

    const [fetchedEntities, setFetchedEntities] = useState<
        DynamicObject[] | null
    >(null);
    const [selectedOrderOption, setSelectedOrderOption] =
        useState<OrderBy | null>(null);
    const [selectedShowOnPage, setSelectedShowOnPage] =
        useState<ShowOnPageOption>(DEFAULT_SHOW_ON_PAGE);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredTotalCount, setFilteredTotalCount] = useState(0);

    /**
     * Parse XML
     */

    const EntityType = view.getAttribute('EntityType');

    if (!EntityType) {
        console.error(`Couldn't find an entity type at register view`);
        return null;
    }

    const ViewName = view.getAttribute('Name');
    if (!ViewName) {
        console.error(`Couldn't find a name from register view root element`);
        return null;
    }

    const TableRowContextMenuElement = view
        .getElementsByTagName('ContextMenu')
        .item(0);
    const TableRowContextMenuItemsFormatted: {
        Text: string;
        Command: Element[];
    }[] = [];

    if (TableRowContextMenuElement) {
        const ContextMenuItems = Array.from(
            TableRowContextMenuElement.children,
        );

        if (ContextMenuItems) {
            for (const elem of ContextMenuItems) {
                const Text = elem.getAttribute('Text');
                const Command = Array.from(elem.children);
                if (Text === null) continue;
                TableRowContextMenuItemsFormatted.push({ Text, Command });
            }
        }
    }

    const EntitySchema = getEntitySchema(EntityType);
    const OrderOptionsEl = view.getElementsByTagNameNS(null, 'OrderOptions')[0];

    if (!EntitySchema) {
        console.error(`Did not find Schema for entity '${EntityType}'`);
        return null;
    }

    const orderBy: OrderBy[] = parseOrderOptions(OrderOptionsEl, EntitySchema);
    !selectedOrderOption && setSelectedOrderOption(orderBy[0] || null);

    const tableData = parseRegisterMetaView(view);

    /**
     * Event handling
     */

    const doMutate = (EntitySearchOptions?: EntitySearchOptionsType) => {
        mutation.mutate(EntitySearchOptions || buildEntitySearchOptions());
    };

    const handleSelectOrderBy = (option: OrderBy) => {
        setSelectedOrderOption(() => {
            return JSON.parse(JSON.stringify(option));
        });
    };

    const isSelectedShowOnPage = (num: ShowOnPageOption) => {
        return selectedShowOnPage === num;
    };

    const handleSelectShowOnPage = (num: ShowOnPageOption) => {
        setSelectedShowOnPage(num);
    };

    /**
     * Mutations
     */

    const buildEntitySearchOptions = (): EntitySearchOptionsType => ({
        EntityType: EntityType,
        Skip: selectedShowOnPage * (currentPage - 1),
        Take: selectedShowOnPage,
        //Filters: {},
        //SubArgs: {},
        OrderBy: selectedOrderOption && [
            ...selectedOrderOption.OrderBy.OrderOptionNames,
        ],
        PropertiesToSelect: [],
        IgnoreCalculatedProperties: false,
        SearchLanguage: getUserLanguage(),
        Purpose: 'Register',
        PurposeArgs: {
            ViewName: ViewName,
        },
        IncludeUnfilteredTotalCount: true,
        IncludeFilteredTotalCount: true,
        //MissingPropertyIsError: true,
    });

    const mutation = useMutation({
        mutationFn: getEntitiesForRegisterView,
        onSuccess: (data) => {
            setFetchedEntities(data.Results);
            setFilteredTotalCount(data.FilteredTotalCount);
        },
    });

    useEffect(() => {
        doMutate();
    }, [selectedOrderOption, selectedShowOnPage]);

    /**
     * Render
     */

    return (
        <>
            {mutation.isLoading && <LoadingSpinner />}
            {fetchedEntities && fetchedEntities.length > 0 && (
                <>
                    <Toolbar
                        isSelectedShowOnPage={isSelectedShowOnPage}
                        handleSelectShowOnPage={handleSelectShowOnPage}
                        filteredTotalCount={filteredTotalCount}
                        orderOptions={orderBy}
                        selectedOrderOption={selectedOrderOption}
                        handleSelectOrderBy={handleSelectOrderBy}
                    />
                    <RegisterTable
                        tableData={tableData}
                        entities={fetchedEntities}
                        entityType={EntityType}
                        contextMenu={TableRowContextMenuItemsFormatted}
                    />
                </>
            )}
            {fetchedEntities && fetchedEntities.length < 1 && (
                <p className={`text-2xl px-8 py-4`}>No table data</p>
            )}
        </>
    );
};
