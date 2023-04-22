import { DynamicObject } from '../types/DynamicObject';
import { AssociationType } from '../types/AssociationType';

export const getAssociationType = (
    propertySchemaObj: DynamicObject | undefined,
): AssociationType | null => {
    if (propertySchemaObj?.IsRealAssociation) {
        if (propertySchemaObj?.AssociationInfo?.AssociationType === 1) {
            return AssociationType.Aggregation;
        } else {
            return AssociationType.Composition;
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
        if (obj.associationType === AssociationType.Composition) {
            for (const [key, value] of Object.entries(obj)) {
                if (key !== 'associationType' && key !== 'Id') {
                    obj[key] = { _update: [value] };
                }
            }
        } else if (obj.associationType === AssociationType.Aggregation) {
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
            if (Object.hasOwn(result, key)) {
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
    if (Object.hasOwn(accumulator, key)) {
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
