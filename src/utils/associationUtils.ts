import { DynamicObject } from '../types/DynamicObject';

type AssociationType = 'Composition' | 'Aggregation' | null;

export const getAssociationType = (
    propertySchemaObj: DynamicObject | undefined,
): AssociationType | null => {
    if (propertySchemaObj?.IsRealAssociation) {
        if (propertySchemaObj?.AssociationInfo?.AssociationType === 1) {
            return 'Aggregation';
        } else {
            return 'Composition';
        }
    } else {
        return null;
    }
};

export const mapAssociationTypePatchCommands = (
    inputArray: DynamicObject[],
) => {
    const objectArray = [...inputArray];
    for (let i = 0; i < objectArray.length; i++) {
        const obj = objectArray[i];
        if (obj.associationType === 'Composition') {
            for (const [key, value] of Object.entries(obj)) {
                if (key !== 'associationType' && key !== 'Id') {
                    obj[key] = { _update: [value] };
                }
            }
        } else if (obj.associationType === 'Aggregation') {
            for (const [key, value] of Object.entries(obj)) {
                if (key !== 'associationType' && key !== 'Id') {
                    obj[key] = { _set_ref: [value] };
                }
            }
        }
        delete obj.associationType;
    }
    return objectArray;
};

export const commonFieldsReducer = (
    accumulator: DynamicObject,
    currentObject: DynamicObject,
) => {
    const mergeObjects = (
        obj1: DynamicObject,
        obj2: DynamicObject,
    ): DynamicObject => {
        const result: DynamicObject = { ...obj1 };
        for (const [key, value] of Object.entries(obj2)) {
            // eslint-disable-next-line no-prototype-builtins
            if (result.hasOwnProperty(key)) {
                const currentValue = result[key];
                if (Array.isArray(currentValue) && Array.isArray(value)) {
                    result[key] = currentValue.concat(value);
                } else if (
                    typeof currentValue === 'object' &&
                    typeof value === 'object'
                ) {
                    result[key] = mergeObjects(currentValue, value);
                } else {
                    result[key] = value;
                }
            } else {
                result[key] = value;
            }
        }
        return result;
    };

    const [key, value] = Object.entries(currentObject)[0];
    // eslint-disable-next-line no-prototype-builtins
    if (accumulator.hasOwnProperty(key)) {
        if (Array.isArray(accumulator[key]?._set_ref)) {
            const setRefArray = accumulator[key]._set_ref.concat(
                value._set_ref,
            );
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            accumulator[key]._set_ref = [mergeObjects(...setRefArray)];
        } else if (Array.isArray(accumulator[key]?._update)) {
            const updateArray = accumulator[key]._update.concat(value._update);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            accumulator[key]._update = [mergeObjects(...updateArray)];
        } else {
            accumulator[key] = mergeObjects(accumulator[key], value);
        }
    } else {
        accumulator[key] = value;
    }
    return accumulator;
};
