import { RegisterView } from './RegisterView';
import { useNavigate, useParams } from 'react-router-dom';
import { ViewHeader } from './ViewHeader';
import { useIsFetching, useQuery } from '@tanstack/react-query';
import { getViewFromSchemaByName } from '../../utils/Parser';
import { schemaQuery } from '../../temp/SchemaUtils';
import { CardView } from './CardView';
import { useEffect } from 'react';

export const ShowView = () => {
    const { data: schema } = useQuery(schemaQuery());
    const { viewId } = useParams();
    const { Id } = useParams();
    const navigate = useNavigate();

    const {
        data: entity,
        isError,
        error,
    } = useQuery({
        queryKey: ['schema', 'metaview', viewId],
        queryFn: () => getViewFromSchemaByName(schema!, viewId!),
        enabled: !!schema,
    });
    const isLoadingSchema = useIsFetching(['schema', 'metaview', viewId]) > 0;

    useEffect(() => {
        if (isError) {
            console.log(error);
            navigate('/somewhere');
        }
    }, [isError, error]);

    const Header = entity?.documentElement.getAttribute('Header');

    return (
        <>
            {isLoadingSchema && <p>Loading view</p>}

            {entity && viewId && viewId.includes('Register') ? (
                <>
                    {Header && <ViewHeader header={Header} />}
                    <section className={`flex flex-col pb-4`}>
                        {entity && viewId && (
                            <RegisterView
                                key={entity.documentElement.getAttribute(
                                    'Name',
                                )}
                                view={entity.documentElement}
                            />
                        )}
                    </section>
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
