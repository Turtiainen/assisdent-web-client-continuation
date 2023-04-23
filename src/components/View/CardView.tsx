import { DynamicObject } from '../../types/DynamicObject';
import { ErrorPage } from '../ErrorPage';
import {
    getViewModelData,
    postEntityData,
    saveViewModelData,
} from '../../services/backend';
import { LoadingSpinner } from '../LoadingSpinner';
import { parseCardMetaView } from '../../utils/Parser';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ViewHeader } from './ViewHeader';
import { getUserLanguage, resolveCardBindings } from '../../utils/utils';
import { CardViewBuilder } from './CardView/CardViewBuilder';
import Button from '../Button';
import {
    commonFieldsReducer,
    mapAssociationTypeAddNewPatchCommands,
    mapAssociationTypeUpdatePatchCommands,
} from '../../utils/associationUtils';
import { mapObjectPaths } from '../../utils/mapUtils';
import { Footer } from '../Footer';

export type DataProps = {
    view: Element;
};

type saveViewModelOptionsType = {
    ViewName: string | null;
    ViewModelData: DynamicObject;
    ArgumentType: string;
};

type saveNewEntityOptionsType = {
    EntityType: string | null;
    Entity: DynamicObject;
    PropertiesToSelect: string[];
};

export const CardView = ({ view }: DataProps) => {
    const [cardData, setCardData] = useState<DynamicObject | null>(null);
    const [changedValues, setChangedValues] = useState<Array<DynamicObject>>(
        [],
    );
    const navigate = useNavigate();

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

    if (Id === 'new') {
        resolvedHeader = view.getAttribute('NewCardHeader');
    } else if (Header?.includes('{')) {
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
            mutation.mutate(viewModelSearchOptions);
        },
    });

    const postNew = useMutation({
        mutationFn: postEntityData,
        onError: (error) => {
            console.log('error :>> ', error);
        },
        onSuccess: (apiData) => {
            console.log('apiData :>> ', apiData);
            // FIXME for some reason this renders empty page
            navigate(`/view/${viewName}/${apiData.Id}`);
        },
    });

    useEffect(() => {
        if (Id === 'new') {
            setCardData(null);
        } else {
            mutation.mutate(viewModelSearchOptions);
        }
    }, []);

    const saveChanges = async () => {
        // We add proper patch commands to objects if necessary
        const changedValuesWithPatchCommands =
            mapAssociationTypeUpdatePatchCommands(changedValues);

        const reducedChangedValues = changedValuesWithPatchCommands.reduce(
            commonFieldsReducer,
            {},
        );

        const saveViewModelOptions: saveViewModelOptionsType = {
            ViewName: viewName,
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
        setChangedValues([]);
    };

    const addNew = async () => {
        const changedValuesWithPatchCommands =
            mapAssociationTypeAddNewPatchCommands(changedValues);

        const reducedChangedValues = changedValuesWithPatchCommands.reduce(
            commonFieldsReducer,
            {},
        );

        const addNewEntityOptions: saveNewEntityOptionsType = {
            EntityType: entityType,
            Entity: reducedChangedValues,
            PropertiesToSelect: mapObjectPaths(reducedChangedValues),
        };

        console.log('addNewEntityOptions', addNewEntityOptions);
        postNew.mutate(addNewEntityOptions);
        setChangedValues([]);
    };

    const cancelChanges = () => {
        setChangedValues([]);
    };

    const cancelNew = () => {
        navigate(-1);
    };

    const constructCardView = (parsedCardMetaView: DynamicObject) => {
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
            {Id === 'new' && constructCardView(parsedCardMetaView)}
            <Footer>
                <Button
                    onClick={
                        Id === 'new' ? () => addNew() : () => saveChanges()
                    }
                    disabled={changedValues.length === 0}
                >
                    {`Tallenna ${Id === 'new' ? '' : 'muutokset'}`}
                </Button>
                <Button
                    onClick={
                        Id === 'new' ? () => cancelNew() : () => cancelChanges()
                    }
                    disabled={Id === 'new' ? false : changedValues.length === 0}
                >
                    {`Peruuta ${Id === 'new' ? '' : 'muutokset'}`}
                </Button>
            </Footer>
        </>
    );
};
