import { DynamicObject } from '../../../types/DynamicObject';
import { ListItemRow } from '../ListItemRow';

type TranslationListProps = {
    translations: DynamicObject[];
};

const rowData: DynamicObject[] = [
    {
        attributes: { Caption: 'Kieli', Value: '{Binding Language}' },
        name: 'Element',
    },
    {
        attributes: { Caption: 'Kuvaus', Value: '{Binding Text}' },
        name: 'Element',
    },
];

export const TranslationList = ({ translations }: TranslationListProps) => {
    if (!translations || translations.length === 0) return null;

    return (
        <table className={`border-collapse border-spacing-1 bg-white w-full`}>
            <thead className={`bg-[#d2dce6]`}>
                <tr>
                    {rowData?.map((col) => {
                        const header = col?.attributes?.Caption;
                        const binding = col?.attributes?.Value;
                        return (
                            <th
                                key={header.toString().concat('-', binding)}
                                className="text-left p-2 font-semibold text-slate-600"
                            >
                                {header}
                            </th>
                        );
                    })}
                    <th className="text-left w-8 p-2 font-semibold text-slate-600"></th>
                </tr>
            </thead>
            <tbody>
                {translations.map((listItem: DynamicObject) => {
                    return (
                        <ListItemRow
                            key={'language-'.concat(listItem.Language)}
                            listItem={listItem}
                            rowData={rowData}
                            entityType={null}
                        />
                    );
                })}
            </tbody>
            <tfoot>
                <tr>
                    <td className={`p-2`}>
                        <select
                            className={`border rounded p-1 pr-4`}
                            value={''}
                            onChange={() => {
                                console.log(`dropdown onChange triggered`);
                            }}
                        >
                            <option value={''} disabled>
                                Lisää uusi...
                            </option>
                            <option value={`test`}>Test</option>
                        </select>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
};
