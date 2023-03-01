import React, { useState } from 'react';
import {useQuery} from "@tanstack/react-query";
import {getCardViews} from "../../utils/Parser";
import { useParams } from 'react-router-dom';
import Dropdown from "../Dropdown";
import Button from "../Button";
import { Link } from 'react-router-dom';

type CardViewSelectProps = {
    selectCardEntity: (name: string) => void
}

export const CardViewSelect: React.FC<CardViewSelectProps> = ({
    selectCardEntity: selectCard,
}) => {
    console.log('render CardViewSelect');
    
    
    const [ selection, setSelection ] = useState<string>('');
    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ['getCardViews'],
        queryFn: async () => {
            return await getCardViews();
        },
    });
    console.log('selection', selection);


    let { cardid } = useParams();
    if (cardid) {
        const cardDocument = data?.find(
            (element) => element.documentElement.getAttribute('Name') == cardid,
        );
        if (cardDocument) {
            if (!selection) {
                setSelection(cardid);
                selectCard(cardid);
            };
        };
    }

    const cardViewNames: string[] = data?.map((doc: Document, idx: React.Key) => {
        return doc?.documentElement.getAttribute('Name');
    }) as string[];

    const loadingSpinner = <p>Loading...</p>;

    const handleSelectionChange = (value: string) => {
        console.log('handle selection', value);
        setSelection(value);
    }
 
    return (
        <>
            {error && <p>There was an error while loading register views</p>}
            {isLoading && loadingSpinner}
            {data && data.length > 0 && (
            <>
                <Dropdown 
                    label={'Cards'}
                    options={cardViewNames}
                    onChange={(value) => handleSelectionChange(value)}
                    value={selection}
                />
                <Button onClick={() => selectCard(selection)}><Link to={`/card/${selection}`}>Valihe</Link></Button>
            </>
            )}
        </>
    );
};