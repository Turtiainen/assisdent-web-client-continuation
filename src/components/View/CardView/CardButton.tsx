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
                    className="font-semibold text-ad-primary hover:text-ad-primary-hover"
                    to={`/view/${entity}RegisterView`}
                >
                    {element.attributes.Text}
                </Link>
            );
        case 'NavigateToCardCommand': {
            const cardIdToNavigate = resolveCardBindings(cardData, childrenId);
            return (
                <div className="flex flex-col lg:flex-row lg:gap-32">
                    <div>{element.attributes.Caption}</div>
                    <Link
                        className="font-semibold text-ad-primary hover:text-ad-primary-hover"
                        to={`/view/${entity}CardView/${cardIdToNavigate?.toString()}`}
                    >
                        {element.attributes.Text}
                    </Link>
                </div>
            );
        }
        case 'CommandReference':
            return (
                <div className="flex flex-col lg:flex-row lg:gap-32">
                    <div>
                        <b>Tämän pitäis aueta popuppina? </b>
                    </div>
                    <Link
                        className="font-semibold text-ad-primary hover:text-ad-primary-hover"
                        to={`/`}
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
