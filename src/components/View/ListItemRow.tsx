import { DynamicObject } from '../../types/DynamicObject';
import { resolveCardBindings } from '../../utils/utils';
import { CardButton } from './CardView/CardButton';

export const ListItemRow = ({
    listItem,
    rowData,
}: {
    listItem: DynamicObject;
    rowData: DynamicObject;
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
