import { useParams } from 'react-router-dom';
import { getEntitySchema } from '../../../temp/SchemaUtils';
import { DynamicObject } from '../../../types/DynamicObject';
import { resolveCardBindings, sanitizeBinding } from '../../../utils/utils';

export const CardSearch = ({
    element,
    cardData,
}: {
    element: DynamicObject;
    cardData: DynamicObject | null;
}) => {
    const getPrintStyleFromEntitySchema = (
        entity: DynamicObject,
    ): string | null => {
        let name = '';
        if (entity.Type === 'List' && entity.SubType) {
            name = entity.SubType.Type;
        } else name = entity.Type;

        const foundObject = getEntitySchema(name);
        if (foundObject) {
            return foundObject.Metadata.Metadata.$Entity.ToString;
        }
        return null;
    };

    const constructValuePrintStyle = (
        content: string | DynamicObject | null | undefined,
        valuePrintStyle: string | null | undefined,
    ) => {
        if (!content || !valuePrintStyle) {
            return '';
        }
        const data =
            typeof content === 'string' ? JSON.parse(content) : content;

        const result = valuePrintStyle.replace(/{{(.*?)}}/g, (_, key) => {
            const value = key
                .split('.')
                .reduce((obj: string, k: number) => obj?.[k], data);
            return value === undefined ? '' : value;
        });

        return result;
    };

    const { viewId } = useParams();
    const cardEntityName = viewId && viewId.replace('CardView', '');
    const entitySchema = getEntitySchema(cardEntityName);
    const woEntity = sanitizeBinding(element.attributes.Value).replace(
        'Entity.',
        '',
    );

    const content = resolveCardBindings(cardData, element.attributes.Value);
    const searchEntityName = woEntity.split('.')[0];
    const valueEntity = entitySchema?.Properties[searchEntityName];
    const valuePrintStyle =
        valueEntity && getPrintStyleFromEntitySchema(valueEntity);
    const value = constructValuePrintStyle(content, valuePrintStyle);

    return (
        <div className={`flex flex-col lg:flex-row lg:gap-32`}>
            <label
                htmlFor={element.attributes.Identifier}
                className={`text-sm font-semibold text-ad-grey-800 flex items-center lg:w-1/4`}
            >
                {element.attributes.Caption}
            </label>
            <div
                id={element.attributes.Identifier}
                className={`flex-1 max-h-12 border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
            >
                {value ? value : `${element.attributes.Caption}`}
            </div>
        </div>
    );
};
