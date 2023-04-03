import { getCatalogType } from '../../../temp/SchemaUtils';
import { DynamicObject } from '../../../types/DynamicObject';

export const CardCustom = ({ element }: { element: DynamicObject }) => {
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
        default:
            return (
                <p>
                    {`Custom element type: ${element.attributes.Type} not
                                            yet implemented`}
                </p>
            );
    }
};
