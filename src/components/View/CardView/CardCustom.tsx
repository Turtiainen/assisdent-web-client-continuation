import { getCatalogType } from '../../../temp/SchemaUtils';
import { DynamicObject } from '../../../types/DynamicObject';
import { CardSearch } from './CardSearch';

export const CardCustom = ({
    element,
    cardData,
    entityType,
    updateChangedTextInputValue,
}: {
    element: DynamicObject;
    cardData: DynamicObject | null;
    entityType: string | null;
    updateChangedTextInputValue: (
        valueString: string,
        key: string,
        value: string | number | boolean | null,
    ) => void;
}) => {
    switch (element.attributes.Type) {
        case 'CardContactMethods': {
            const contactMethods = getCatalogType('ContactMethodEnum');
            return (
                <div className={`flex flex-col lg:flex-col col-span-2`}>
                    <h2 className="text-xl font-semibold py-4">
                        {element.attributes.Caption.toUpperCase()}
                    </h2>
                    {contactMethods &&
                        contactMethods.Entries.map((contactMethod) => (
                            <label
                                key={contactMethod.Key.toString()}
                                className="py-1 text-base font-semibold text-ad-grey-800 flex items-center lg:w-1/4"
                            >
                                {contactMethod.DisplayName}
                            </label>
                        ))}
                </div>
            );
        }
        case 'SearchSoteRegister': {
            // TODO: Implement SearchSoteRegister element type
            console.log('element type SearchSoteRegister :>> ', element);
            return (
                <CardSearch
                    element={element}
                    cardData={cardData}
                    entityType={entityType}
<<<<<<< HEAD
                    viewName={`${entityType}CardView`}
                    elementIdentifier={element.attributes?.Identifier}
                    updateChangedTextInputValue={updateChangedTextInputValue}
=======
                    viewName={null}
                    elementIdentifier={null}
>>>>>>> cde5374 (Fix npm run build)
                />
            );
        }
        case 'SearchIAHRegister': {
            // TODO: Implement SearchIAHRegister element type
            console.log('element type SearchIAHRegister :>> ', element);
            return (
                <CardSearch
                    element={element}
                    cardData={cardData}
                    entityType={entityType}
<<<<<<< HEAD
                    viewName={`${entityType}CardView`}
                    elementIdentifier={element.attributes?.Identifier}
                    updateChangedTextInputValue={updateChangedTextInputValue}
=======
                    viewName={null}
                    elementIdentifier={null}
>>>>>>> cde5374 (Fix npm run build)
                />
            );
        }
        default:
            return (
                <p>
                    {`Custom element type: ${element.attributes.Type} not
                                            yet implemented`}
                </p>
            );
    }
};
