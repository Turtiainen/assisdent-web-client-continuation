import { DynamicObject } from '../types/DynamicObject';

export const mapObjectValueByIntendedUse = (
    value: any,
    intendedUse: string,
) => {
    switch (intendedUse) {
        case 'Percentage':
            return `${parseFloat(value) * 100}%`;
        default:
            return value;
    }
};

export const mapObjectPaths = (
    obj: DynamicObject,
    parentKey = '',
    paths: string[] = [],
) => {
    for (const [key, value] of Object.entries(obj)) {
        if (key === 'Id' || key.startsWith('_')) {
            continue;
        }
        const currentKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof value === 'object' && !Array.isArray(value)) {
            mapObjectPaths(value, currentKey, paths);
        } else {
            paths.push(currentKey);
        }
    }
    return paths;
};
