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
    const EntityType = entity?.documentElement.getAttribute('EntityType');

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
                    <ApplicationBar>
                        <Link to={`/view/${EntityType}CardView/new`}>
                            <Button onClick={() => null} buttonType={'primary'}>
                                Lisää uusi
                            </Button>
                        </Link>
                    </ApplicationBar>
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
