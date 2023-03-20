import { DynamicObject } from '../../types/DynamicObject';
import { resolveCardBindings } from '../../utils/utils';

export const ListItemRow = ({
    listItem,
    columnsAndBindings,
}: {
    listItem: DynamicObject;
    columnsAndBindings: Map<number, [string, string]>;
}) => {
    return (
        <tr
            className={`border-b border-gray-300 hover:bg-blue-100/30 transition-[background-color] duration-300 ease-in-out`}
        >
            {Array.from(columnsAndBindings.values()).map((column) => {
                const value = resolveCardBindings(listItem, column[1]);

                if (value === null || value === undefined) return null;

                return (
                    <td
                        key={column[0].toString().concat(column[1])}
                        className={`p-2`}
                    >
                        {value.toString()}
                    </td>
                );
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
