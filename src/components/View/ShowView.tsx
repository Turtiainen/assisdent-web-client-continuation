import { RegisterView } from './RegisterView';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ViewHeader } from './ViewHeader';
import { useIsFetching, useQuery } from '@tanstack/react-query';
import { getViewFromSchemaByName } from '../../utils/Parser';
import { CardView } from './CardView';
import React, { useEffect } from 'react';
import useSchemaStore from '../../store/store';
import { SchemaStore } from '../../types/SchemaStore';
import Button from '../Button';
import { ApplicationBar } from '../ApplicationBar';
import { getRegisterMetaViewAsObject } from '../../utils/objectUtils';
import { DynamicObject } from '../../types/DynamicObject';

export const ShowView = () => {
    const schema = useSchemaStore((state: SchemaStore) => state.schema);
    const { viewId } = useParams();
    const { Id } = useParams();
    const navigate = useNavigate();

    const {
        data: entity,
        isError,
        error,
    } = useQuery({
        queryKey: ['schema', 'metaview', viewId],
        queryFn: () => getViewFromSchemaByName(schema, viewId!),
        enabled: Object.keys(schema).length > 0,
    });
    const isLoadingSchema = useIsFetching(['schema', 'metaview', viewId]) > 0;

    useEffect(() => {
        if (isError) {
            navigate('/somewhere');
        }
    }, [isError, error]);

    const Header = entity?.documentElement.getAttribute('Header');

    let MetaViewObject: DynamicObject = {};
    let NewCardName: string | null = null;
    let createNewCardDisabled = false;

    if (entity) {
        MetaViewObject = getRegisterMetaViewAsObject(entity.documentElement);
        NewCardName = MetaViewObject.CreateNewCardName;
        createNewCardDisabled =
            MetaViewObject.DisableCreateNewEntity === 'true';
    }

    return (
        <>
            {isLoadingSchema && <p>Loading view</p>}

            {entity && viewId && viewId.includes('Register') ? (
                <>
                    {Header && <ViewHeader header={Header} />}
                    <section className={`flex flex-col pb-4`}>
                        {entity && viewId && (
                            <>
                                <RegisterView
                                    key={entity.documentElement.getAttribute(
                                        'Name',
                                    )}
                                    view={entity.documentElement}
                                />
                            </>
                        )}
                    </section>
                    {NewCardName && (
                        <ApplicationBar>
                            <Link to={`/view/${NewCardName}/new`}>
                                <Button
                                    onClick={() => null}
                                    buttonType={'primary'}
                                    disabled={createNewCardDisabled}
                                >
                                    Lisää uusi
                                </Button>
                            </Link>
                        </ApplicationBar>
                    )}
                </>
            ) : (
                <>
                    {entity && viewId && Id && (
                        <CardView view={entity.documentElement} />
                    )}
                </>
            )}
        </>
    );
};
