import { DynamicObject } from '../../types/DynamicObject';
import { resolveCardBindings } from '../../utils/utils';
import { CardButton } from './CardView/CardButton';
import { getEntitySchema, getCatalogType } from '../../temp/SchemaUtils';

export const ListItemRow = ({
    listItem,
    rowData,
    entityType,
}: {
    listItem: DynamicObject;
    rowData: DynamicObject;
    entityType: DynamicObject | null;
}) => {
    return (
        <tr
            className={`border-b border-gray-300 hover:bg-blue-100/30 transition-[background-color] duration-300 ease-in-out`}
        >
            {rowData?.map((col: DynamicObject) => {
                const colHeader =
                    col.attributes?.Caption ?? col.attributes?.ColumnHeader;
                const binding = col.attributes?.Value ?? col.attributes?.Text;

                const cellValue = resolveCardBindings(listItem, binding);
                const nodeType = col?.name;

                if (entityType != null) {
                    // handle displaying actual names in the list element from catalogs
                    const indentifier = col.attributes?.Identifier;
                    const nodeElement = getEntitySchema(entityType.SubType.Type)
                        ?.Properties[indentifier];
                    if (nodeElement?.Type == 'List') {
                        if (
                            getEntitySchema(nodeElement.SubType.Type) ==
                            undefined
                        ) {
                            const catalogList = getCatalogType(
                                nodeElement.SubType.Type,
                            );
                            if (catalogList != undefined) {
                                const displayNames = catalogList.Entries.map(
                                    (e) => {
                                        return {
                                            key: e.Key.toString(),
                                            displayName:
                                                e.DisplayName.toString(),
                                        };
                                    },
                                );
                                const foundCatalogItem = displayNames.find(
                                    (e) => e.key === cellValue?.toString(),
                                );
                                if (foundCatalogItem === undefined) {
                                    let displayName: string | undefined = '';
                                    const keysArray = cellValue
                                        ?.toString()
                                        .split(',');
                                    displayName = keysArray
                                        ?.map(
                                            (key) =>
                                                displayNames.find(
                                                    (e) => e.key === key,
                                                )?.displayName,
                                        )
                                        .join(', ');
                                    return (
                                        <td
                                            key={colHeader
                                                ?.toString()
                                                .concat(binding)}
                                            className={`p-2`}
                                        >
                                            {displayName}
                                        </td>
                                    );
                                } else {
                                    return (
                                        <td
                                            key={colHeader
                                                ?.toString()
                                                .concat(binding)}
                                            className={`p-2`}
                                        >
                                            {foundCatalogItem
                                                ? foundCatalogItem.displayName
                                                : cellValue?.toString()}
                                        </td>
                                    );
                                }
                            }
                        }
                    }
                }

                // Render different cell element depending on nodeType (from schema)
                if (nodeType === 'Button') {
                    return (
                        <td
                            key={colHeader?.toString().concat(binding)}
                            className={`p-2`}
                        >
                            {nodeType === 'Button' && (
                                <CardButton
                                    element={col}
                                    cardData={listItem}
                                    isListItem
                                />
                            )}
                        </td>
                    );
                } else if (cellValue !== null) {
                    return (
                        <td
                            key={colHeader?.toString().concat(binding)}
                            className={`p-2`}
                        >
                            {cellValue?.toString()}
                        </td>
                    );
                } else {
                    return null;
                }
            })}
            <td className={`p-2`}>
                <div
                    className={`bg-gray-300 p-1 text-xs rounded-full hover:bg-gray-200 hover:cursor-pointer`}
                >
                    ❌
                </div>
            </td>
        </tr>
    );
};
