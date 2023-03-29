import { Key } from 'react';
import { Link } from 'react-router-dom';
import { DtoProperty } from '../../../types/DtoProperty';
import { DynamicObject } from '../../../types/DynamicObject';
import { resolveCardBindings } from '../../../utils/utils';
import { CardElement } from './CardElement';
import { CardGroup } from './CardGroup';
import { CardList } from './CardList';

type ElementAttributesType = {
    __id: string;
    [index: string]: string;
};

type CardElementType = {
    name: 'Group' | 'List' | 'Element' | 'Search' | 'Button';
    attributes: ElementAttributesType;
    [index: string]: unknown;
};

export const CardViewBuilder = ({
    elements,
    cardData,
    entityPropertySchema,
}: {
    elements: Array<CardElementType>;
    cardData: DynamicObject | null;
    entityPropertySchema: { [index: string]: DtoProperty } | undefined;
}) => {
    return (
        <>
            {elements.map((element: CardElementType) => {
                switch (element.name) {
                    case 'Group':
                        return (
                            <CardGroup
                                key={element.attributes['__id'] as Key}
                                group={element}
                                cardData={cardData}
                                entityPropertySchema={entityPropertySchema}
                            />
                        );
                    case 'List':
                        return (
                            <CardList
                                key={element.attributes['__id'] as Key}
                                element={element}
                                cardData={cardData}
                            />
                        );
                    case 'Element':
                        return (
                            <CardElement
                                key={element.attributes['__id'] as Key}
                                element={element}
                                cardData={cardData}
                                entityPropertySchema={entityPropertySchema}
                            />
                        );
                    case 'Search':
                        //console.log('search element :>> ', element);
                        return (
                            <p key={element.attributes['__id'] as Key}>
                                {`Element type ${element.name} not
                                            yet implemented`}
                                <b>{` - Caption: ${element.attributes.Caption} `}</b>
                            </p>
                        );
                    case 'Button': {
                        const children = element.children as DynamicObject;
                        const elementName = children?.[0].name;
                        const entity = children?.[0].attributes.Entity;
                        const childrenId = children?.[0].attributes.Id;
                        if (elementName === 'NavigateToRegisterCommand') {
                            return (
                                <Link
                                    key={element.attributes['__id'] as Key}
                                    className="font-semibold text-ad-primary hover:text-ad-primary-hover"
                                    to={`/view/${entity}RegisterView`}
                                >
                                    {element.attributes.Text}
                                </Link>
                            );
                        } else if (elementName === 'NavigateToCardCommand') {
                            const cardIdToNavigate = resolveCardBindings(
                                cardData,
                                childrenId,
                            );
                            return (
                                <div
                                    key={element.attributes['__id'] as Key}
                                    className="flex flex-col lg:flex-row lg:gap-32"
                                >
                                    <div>{element.attributes.Caption}</div>
                                    <Link
                                        className="font-semibold text-ad-primary hover:text-ad-primary-hover"
                                        to={`/view/${entity}CardView/${cardIdToNavigate?.toString()}`}
                                    >
                                        {element.attributes.Text}
                                    </Link>
                                </div>
                            );
                        } else if (elementName === 'CommandReference') {
                            return (
                                <div
                                    key={element.attributes['__id'] as Key}
                                    className="flex flex-col lg:flex-row lg:gap-32"
                                >
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
                        } else {
                            console.log(
                                'button element type not implemented :>> ',
                                element,
                            );
                            return (
                                <p key={element.attributes['__id'] as Key}>
                                    {`Element type ${element.name} not
                                            yet implemented`}
                                    <b>{` - Text: ${element.attributes.Text} `}</b>
                                </p>
                            );
                        }
                    }
                    default:
                        return (
                            <p key={element.attributes['__id'] as Key}>
                                {`Element type ${element.name} not
                                            yet implemented`}
                            </p>
                        );
                }
            })}
        </>
    );
};
