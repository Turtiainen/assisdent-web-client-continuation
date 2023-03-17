/**
 * This component is only for development purposes
 */

import { findEntitySchema } from './SchemaUtils';
import { DtoEntity } from '../types/DtoEntity';

type PrintEntitiesProps = {
<<<<<<< HEAD
    entityType: string
}
=======
    entityType: string;
};
>>>>>>> development

export const PrintEntities = ({ entityType }: PrintEntitiesProps) => {
    const entities = findEntitySchema(entityType);
    return (
        <div className={`flex px-8 py-4`}>
            {entities?.map((entity: DtoEntity) => {
                return (
                    <div key={entity.Name}>
                        <h3 className={`text-2xl`}>Entity: {entity.Name}</h3>
<<<<<<< HEAD
                        <pre className={`text-xs`}>{JSON.stringify(entity, null, 4)}</pre>
=======
                        <pre className={`text-xs`}>
                            {JSON.stringify(entity, null, 4)}
                        </pre>
>>>>>>> development
                    </div>
                );
            })}
        </div>
    );
};
