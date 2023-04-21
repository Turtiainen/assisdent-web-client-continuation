import { Link } from 'react-router-dom';
import { DynamicObject } from '../../../types/DynamicObject';
import { resolveCardBindings } from '../../../utils/utils';

export const CardButton = ({
    element,
    cardData,
}: {
    element: DynamicObject;
    cardData: DynamicObject | null;
}) => {
    const children = element.children as DynamicObject;
    const elementName = children?.[0].name;
    const entity = children?.[0].attributes.Entity;
    const childrenId = children?.[0].attributes.Id;

    switch (elementName) {
        case 'NavigateToRegisterCommand':
            return (
                <Link
                    className="flex flex-col lg:flex-row lg:gap-32 font-semibold text-ad-primary hover:text-ad-primary-hover"
                    to={`/view/${entity}RegisterView`}
                    id={element.attributes.Identifier}
                >
                    {element.attributes.Text}
                </Link>
            );
        case 'NavigateToCardCommand': {
            let binding = resolveCardBindings(
                cardData,
                element.attributes.Text,
            );
            if (binding && element.attributes.Text.includes('Date')) {
                binding = binding?.split('-').slice(0, 2).reverse().join('/');
            } else if (binding?.includes('noappointment')) {
                binding = 'Ei ajanvarausta';
            }

            const cardIdToNavigate = resolveCardBindings(cardData, childrenId);
            return (
                <div className="flex flex-col lg:flex-row lg:gap-32">
                    <label
                        htmlFor={element.attributes.Identifier}
                        className="text-sm font-semibold text-ad-grey-800 flex items-center lg:w-1/4"
                    >
                        {element.attributes.Caption}
                    </label>
                    {cardIdToNavigate ? (
                        <Link
                            className="flex-1 max-h-12 px-2 py-1 font-semibold text-ad-primary hover:text-ad-primary-hover"
                            to={`/view/${entity}CardView/${cardIdToNavigate?.toString()}`}
                            id={element.attributes.Identifier}
                        >
                            {binding?.toString()}
                        </Link>
                    ) : (
                        <div
                            id={element.attributes.Identifier}
                            className="flex-1 max-h-12 px-2 py-1 text-ad-grey-400"
                        >
                            {binding?.toString()}
                        </div>
                    )}
                </div>
            );
        }
        case 'CommandReference':
            return (
                <div className="flex flex-col lg:flex-row lg:gap-32">
                    <label
                        htmlFor={element.attributes.Identifier}
                        className="text-sm font-semibold text-ad-grey-800 flex items-center lg:w-1/4"
                    >
                        <b>Tämän pitäis aueta popuppina? </b>
                    </label>
                    <Link
                        className="flex-1 max-h-12 px-2 py-1 font-semibold text-ad-primary hover:text-ad-primary-hover"
                        to={`/`}
                        id={element.attributes.Identifier}
                    >
                        {element.attributes.Text}
                    </Link>
                </div>
            );
        default:
            console.log('button element type not implemented :>> ', element);
            return (
                <p>
                    {`Button element type ${element.name} not
                                                yet implemented`}
                    <b>{` - Text: ${element.attributes.Text} `}</b>
                </p>
            );
    }
};
