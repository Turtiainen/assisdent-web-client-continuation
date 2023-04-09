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
    // const key = Object.keys(currentObject)[0];
    // const value = currentObject[key];
    //
    // if (accumulator[key]) {
    //     if (value._update) {
    //         accumulator[key]._update.push(value._update[0]);
    //     } else if (value._set_ref) {
    //         accumulator[key]._set_ref.push(value._set_ref[0]);
    //     } else {
    //         Object.assign(accumulator[key], value);
    //     }
    // } else {
    //     accumulator[key] = value;
    // }
    //
    // return accumulator;

    const [key, value] = Object.entries(currentObject)[0];
    // eslint-disable-next-line no-prototype-builtins
    if (accumulator.hasOwnProperty(key)) {
        if (Array.isArray(accumulator[key]._update)) {
            accumulator[key]._update[0] = {
                ...accumulator[key]._update[0],
                ...value._update[0],
            };
        } else if (Array.isArray(accumulator[key]._set_ref)) {
            accumulator[key]._set_ref[0] = {
                ...accumulator[key]._set_ref[0],
                ...value._set_ref[0],
            };
        } else {
            accumulator[key] = { ...accumulator[key], ...value };
        }
    } else {
        accumulator[key] = value;
    }
    return accumulator;
};
