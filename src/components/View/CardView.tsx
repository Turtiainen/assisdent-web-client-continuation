import { DynamicObject } from '../../types/DynamicObject';
import { ErrorPage } from '../ErrorPage';
import {
    getEntityData,
    getViewModelData,
    putEntityData,
    saveViewModelData,
} from '../../services/backend';
import { LoadingSpinner } from '../LoadingSpinner';
import { parseCardMetaView } from '../../utils/Parser';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ViewHeader } from './ViewHeader';
import { getUserLanguage, resolveCardBindings } from '../../utils/utils';
import { CardViewBuilder } from './CardView/CardViewBuilder';
import Button from '../Button';
import {
    commonFieldsReducer,
    mapAssociationTypePatchCommands,
} from '../../utils/associationUtils';

export type DataProps = {
    view: Element;
};

type saveViewModelOptionsType = {
    ViewName: string | null;
    ViewModelData: DynamicObject;
    ArgumentType: string;
};

export const CardView = ({ view }: DataProps) => {
    const [cardData, setCardData] = useState<DynamicObject | null>(null);
    const [changedValues, setChangedValues] = useState<Array<DynamicObject>>(
        [],
    );

    // const { viewId } = useParams();
    const { Id } = useParams();

    const parsedCardMetaView = parseCardMetaView(view);
    const argumentType = view.getAttribute('ArgumentType');
    const userLanguage = getUserLanguage();
    const argument = {
        Id: Id,
    };
    const viewName = view.getAttribute('Name');
    const entityType = view.getAttribute('EntityType');
    const Header = view.getAttribute('Header');
    let resolvedHeader: string | null;

    if (Header?.includes('{')) {
        resolvedHeader =
            cardData &&
            Header &&
            (resolveCardBindings(cardData, Header) as string);
    } else {
        resolvedHeader = Header;
    }
    const SubHeader = view.getAttribute('SubHeader');
    let resolvedSubHeader: string | null;

    if (SubHeader?.includes('{')) {
        resolvedSubHeader =
            cardData &&
            SubHeader &&
            (resolveCardBindings(cardData, SubHeader) as string);
    } else {
        resolvedSubHeader = SubHeader;
    }

    const viewModelSearchOptions = {
        ViewName: viewName,
        ArgumentType: argumentType,
        Argument: argument,
        SearchLanguage: userLanguage,
        AdditionalPropertiesToSelect: [],
    };

    const mutation = useMutation({
        mutationFn: getViewModelData,
        onError: (error) => {
            console.log('error :>> ', error);
        },
        onSuccess: (apiData) => {
            if (apiData) setCardData(apiData.ViewModelData);
        },
    });

    const saveData = useMutation({
        mutationFn: saveViewModelData,
        onError: (error) => {
            console.log('error :>> ', error);
        },
        onSuccess: (apiData) => {
            console.log('apiData :>> ', apiData);
        },
    });

    useEffect(() => {
        mutation.mutate(viewModelSearchOptions);
    }, []);

    const saveChanges = async () => {
        // We add proper patch commands to objects if necessary
        const changedValuesWithPatchCommands =
            mapAssociationTypePatchCommands(changedValues);

        const reducedChangedValues = changedValuesWithPatchCommands.reduce(
            commonFieldsReducer,
            {},
        );

        const saveViewModelOptions: saveViewModelOptionsType = {
            ViewName: viewName,
            // TODO is ArgumentType always in this format?
            ArgumentType: `Edit${viewName}Argument`,
            ViewModelData: {
                Entity: {
                    ...reducedChangedValues,
                    Id: Id,
                },
            },
        };

        console.log('saveViewModelOptions', saveViewModelOptions);
        saveData.mutate(saveViewModelOptions);
        mutation.mutate(viewModelSearchOptions);
        setChangedValues([]);
    };

    const cancelChanges = () => {
        setChangedValues([]);
    };

    const constructCardView = (parsedCardMetaView: DynamicObject) => {
        console.log('constructCardView');
        const updateChangedValues = (
            newChangedValues: Array<DynamicObject>,
        ) => {
            setChangedValues(newChangedValues);
        };
        const newChangedValues = [...changedValues];
        return (
            <>
                {resolvedHeader && (
                    <ViewHeader
                        header={resolvedHeader.toString()}
                        subHeader={resolvedSubHeader?.toString()}
                    />
                )}
                {parsedCardMetaView && (
                    <div className="px-8 grid lg:grid-cols-2 gap-y-2 gap-x-64 pb-16 lg:max-w-[90%]">
                        <CardViewBuilder
                            elements={parsedCardMetaView.children}
                            cardData={cardData}
                            entityType={entityType}
                            updateChangedValues={updateChangedValues}
                            changedValues={newChangedValues}
                        />
                    </div>
                )}
            </>
        );
    };

    return (
        <>
            {mutation.isError && <ErrorPage />}
            {mutation.isLoading && <LoadingSpinner />}
            {mutation.isSuccess &&
                cardData &&
                constructCardView(parsedCardMetaView)}
            {/*TODO just temporary buttons here*/}
            <Button
                onClick={() => cancelChanges()}
                disabled={changedValues.length === 0}
            >
                Peruuta muutokset
            </Button>
            <Button
                onClick={() => saveChanges()}
                disabled={changedValues.length === 0}
            >
                Tallenna muutokset
            </Button>
        </>
    );
};
