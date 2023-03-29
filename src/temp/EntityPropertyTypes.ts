import data from './schema.json';
import { DtoSchema } from '../types/DtoSchema';

const schema = data as unknown as DtoSchema;
const Entities = schema.MetaData.Entities;

const entityPropertyTypeMap = new Map<string, string[]>();

export const getEntityPropertyTypes = () => {
    // console.log(Entities[1]);

    Entities.forEach((entity) => {
        Object.entries(entity.Properties).forEach((property) => {
            const key = property[0];
            const valueObject = property[1];

            if (valueObject.Type) {
                const findableEntity = Entities.find(
                    (entity) => entity.Name === valueObject.Type,
                );

                if (!findableEntity) {
                    if (entityPropertyTypeMap.has(valueObject.Type)) {
                        const temp = entityPropertyTypeMap.get(
                            valueObject.Type,
                        );
                        entityPropertyTypeMap.set(valueObject.Type, [
                            ...temp!,
                            key,
                        ]);
                    } else {
                        entityPropertyTypeMap.set(valueObject.Type, [key]);
                    }
                }
            }
        });
    });

    entityPropertyTypeMap.forEach((value, key) => {
        console.log(`m[${key}] = ${value.length}`);
    });

    console.log(`mapSize`, entityPropertyTypeMap.size);
};
