import { DynamicObject } from '../../types/DynamicObject';
import { resolveCardBindings, resolveEntityBindings } from '../../utils/utils';
import { ListItemRow } from './ListItemRow';
import { useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { getEntitySchema } from '../../temp/SchemaUtils';


type ListProps = {
    xmlElementTree: DynamicObject;
    listData: DynamicObject;
    entityType: string | null;
};

const PrintActions = ({
    actions,
    colCount,
}: {
    actions: DynamicObject[];
    colCount?: number;
}) => {
    const search = actions.find((el) => el.name === 'Search');

    if (search) {
        return (
            <td className={`p-2`} colSpan={colCount}>
                <input
                    type={`text`}
                    placeholder={`Search...`}
                    className={`border p-1 rounded-l`}
                />
                <button
                    className={`border border-l-0 p-1 rounded-r bg-ad-grey-50 hover:bg-ad-primary-hover`}
                >
                    🔍
                </button>
            </td>
        );
    }

    return null;
};

export const List = ({ xmlElementTree, listData, entityType }: ListProps) => {
    const [isContentHidden, setIsContentHidden] = useState(false);

    const resolvedData = resolveCardBindings(
        listData,
        xmlElementTree.attributes.Value,
    );

    if (
        !resolvedData ||
        !Array.isArray(resolvedData) ||
        resolvedData.length === 0
    ) {
        return null;
    }

    const columnsAndBindings = new Map<number, [string, string]>();

    const columnsObject = xmlElementTree.children.find(
        (el: DynamicObject) => el.name === 'Columns',
    );

    if (!columnsObject || columnsObject.children.length === 0) return null;

    columnsObject.children.forEach((node: DynamicObject, idx: number) => {      
        if(node.attributes.Caption != undefined && node.attributes.Value != undefined) {
            columnsAndBindings.set(idx, [
                node.attributes.Caption,
                node.attributes.Value,
            ]);
        }
    });

    const actions: DynamicObject[] = xmlElementTree.children.find(
        (el: DynamicObject) => el.name === 'AddControl',
    ).children;

    return (
        <div className={`basis-full my-8 col-span-2 [column-span:all]`}>
            <SectionHeading
                onClick={() => setIsContentHidden(!isContentHidden)}
            >
                {xmlElementTree.attributes.Caption}
            </SectionHeading>
            {!isContentHidden && (
                <table
                    className={`border-collapse border-spacing-1 bg-white w-full mt-2`}
                >
                    <thead className={`bg-[#d2dce6]`}>
                        <tr>
                            {Array.from(columnsAndBindings.values()).map(
                                (column, idx) => (
                                    <th
                                        key={idx}
                                        className="text-left p-2 font-semibold text-slate-600"
                                    >
                                        {column[0]}
                                    </th>
                                ),
                            )}
                            <th className="text-left w-8 p-2 font-semibold text-slate-600"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {resolvedData.map((listItem: DynamicObject) => {
                            return (
                                <ListItemRow
                                    key={listItem.Id}
                                    listItem={listItem}
                                    columnsAndBindings={columnsAndBindings}
                                />
                            );
                        })}
                    </tbody>
                    {actions && actions.length && (
                        <tfoot>
                            <tr>
                                <PrintActions
                                    actions={actions}
                                    colCount={columnsAndBindings.size + 1}
                                />
                            </tr>
                        </tfoot>
                    )}
                </table>
            )}
        </div>
    );
};
