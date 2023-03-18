import { DynamicObject } from '../../types/DynamicObject';
import { ListItemRow } from './ListItemRow';

type TranslationListProps = {
    translations: DynamicObject[];
};

const columnsAndBindings = new Map<number, [string, string]>([
    [0, ['Kieli', '{Binding Language}']],
    [1, ['Kuvaus', '{Binding Text}']],
]);

export const TranslationList = ({ translations }: TranslationListProps) => {
    if (!translations || translations.length === 0) return null;

    return (
        <table className={`border-collapse border-spacing-1 bg-white w-full`}>
            <thead className={`bg-[#d2dce6]`}>
                <tr>
                    {Array.from(columnsAndBindings.values()).map(
                        (column, idx) => (
                            <th
                                key={column[0]
                                    .toString()
                                    .concat('-', column[1])}
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
                {translations.map((listItem: DynamicObject) => {
                    return (
                        <ListItemRow
                            key={'language-'.concat(listItem.Language)}
                            listItem={listItem}
                            columnsAndBindings={columnsAndBindings}
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
                            onChange={() => {}}
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
