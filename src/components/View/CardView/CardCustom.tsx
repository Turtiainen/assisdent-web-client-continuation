import { getEntitySchema } from '../../../temp/SchemaUtils';
import { DynamicObject } from '../../../types/DynamicObject';

export const CardCustom = ({
    element,
    cardData,
}: {
    element: DynamicObject;
    cardData: DynamicObject | null;
}) => {
    console.log('element :>> ', element);
    console.log('cardData :>> ', cardData);
    const elementSchema = getEntitySchema(element.attributes.Type);
    console.log('elementSchema :>> ', elementSchema);
    switch (element.attributes.Type) {
        case 'CardContactMethods':
            return (
                <div className={`flex flex-col lg:flex-col`}>
                    <h2 className="text-xl font-semibold py-4">
                        {element.attributes.Caption.toUpperCase()}
                    </h2>
                    <label className="text-base font-semibold text-ad-grey-800 flex items-center lg:w-1/4">
                        Soitto
                    </label>
                    <div className="flex-1 max-h-12 px-2 py-2 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none">
                        {' '}
                    </div>
                    <label className="text-base font-semibold text-ad-grey-800 flex items-center lg:w-1/4">
                        Kirje
                    </label>
                    <div className="flex-1 max-h-12 px-2 py-2 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none">
                        {' '}
                    </div>
                    <label className="text-base font-semibold text-ad-grey-800 flex items-center lg:w-1/4">
                        Tekstiviesti
                    </label>
                    <div className="flex-1 max-h-12 px-2 py-2 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none">
                        {' '}
                    </div>
                    <label className="text-base font-semibold text-ad-grey-800 flex items-center lg:w-1/4">
                        Sähköposti
                    </label>
                    <div className="flex-1 max-h-12 px-2 py-2 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none">
                        {' '}
                    </div>
                </div>
            );
        default:
            return (
                <p>
                    {`Custom element type: ${element.attributes.Type} not
                                            yet implemented`}
                </p>
            );
    }
};
