import { useState } from 'react';
import { DynamicObject } from '../../../types/DynamicObject';
import { SectionHeading } from '../SectionHeading';
import { CardViewBuilder } from './CardViewBuilder';

export const CardGroup = ({
    group,
    cardData,
    entityType,
    updateChangedValues,
    updateErrors,
    changedValues,
    errors,
}: {
    group: DynamicObject;
    cardData: DynamicObject | null;
    entityType: string | null;
    updateChangedValues: (changedValues: Array<DynamicObject>) => void;
    updateErrors: (errors: string[]) => void;
    changedValues: Array<DynamicObject>;
    errors: string[];
}) => {
    const [isContentHidden, setIsContentHidden] = useState(false);

    return (
        group.children?.length && (
            <>
                {group.attributes.Caption && (
                    <SectionHeading
                        onClick={() => setIsContentHidden(!isContentHidden)}
                    >
                        {group.attributes.Caption}
                    </SectionHeading>
                )}

                {!isContentHidden && (
                    <CardViewBuilder
                        elements={group.children}
                        cardData={cardData}
                        entityType={entityType}
                        updateChangedValues={(newValues) =>
                            updateChangedValues(newValues)
                        }
                        updateErrors={(errors) => updateErrors(errors)}
                        changedValues={changedValues}
                        errors={errors}
                    />
                )}
            </>
        )
    );
};
