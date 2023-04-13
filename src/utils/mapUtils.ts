// TODO is there some other types of intended use?
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
    // console.log('obj in mapObjectPaths', obj);
    // let paths: string[] = [];
    //
    // for (const key in obj) {
    //     const path = parentKey ? `${parentKey}.${key}` : key;
    //     if (typeof obj[key] === 'object' && obj[key] !== null) {
    //         paths = paths.concat(mapObjectPaths(obj[key], path));
    //     } else if (Array.isArray(obj[key])) {
    //         paths = paths.concat(mapObjectPaths(obj[key][0], path));
    //     } else {
    //         paths.push(path);
    //     }
    // }
    //
    // return paths;

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
