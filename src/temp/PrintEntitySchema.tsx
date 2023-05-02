import json from './schema.json';
import { DtoSchema } from '../types/DtoSchema';
import { ChangeEventHandler, useState } from 'react';
import { DtoEntity } from '../types/DtoEntity';

export const PrintEntitySchema = () => {
    const [filter, setFilter] = useState<string | null>(null);

    const filterDocuments: ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        if (e.target.value.length < 3) setFilter(null);
        else setFilter(e.target.value);
    };

    // Force type conversion to DtoSchema
    const data = json as unknown as DtoSchema;
    let EntityList = data.MetaData.Entities;

    if (filter !== null) {
        EntityList = data.MetaData.Entities.filter((entity) =>
            entity.Name.toLowerCase().includes(filter.toLowerCase()),
        );
    }

    const PrintEntity = ({ entity }: { entity: DtoEntity }) => {
        const [isHidden, setIsHidden] = useState<boolean>(true);

        return (
            <div key={entity.Name} className={`pb-4 mb-4 border-b-2`}>
                <h2
                    className={`text-xl font-bold hover:underline hover:cursor-pointer`}
                    onClick={() => setIsHidden(!isHidden)}
                >
                    {entity.Name}
                </h2>
                <pre className={`${isHidden && 'max-h-0'} overflow-hidden`}>
                    {JSON.stringify(entity, null, 4)}
                </pre>
            </div>
        );
    };

    return (
        <div className={`p-8`}>
            <div className={`pb-4`}>
                <label htmlFor={`filter`}>Filter</label>
                <input
                    type="text"
                    id={`filter`}
                    onChange={filterDocuments}
                    className={`border rounded ml-2`}
                />
            </div>
            <hr />
            <div className={`py-4`}>
                {filter &&
                    EntityList.map((entity) => (
                        <PrintEntity entity={entity} key={entity.Name} />
                    ))}
            </div>
        </div>
    );
};
