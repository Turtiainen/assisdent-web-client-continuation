import {
    backgroundContainer,
    containerFull,
    continueButton,
    fieldContainer,
    helperText,
    helpText,
    inputField,
    secondaryTitle,
    warningIcon,
    warningIconBackground,
} from '../styles/globalStyles';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const FieldChoice = () => {
    const [field, setField] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setField(e.target.value);
    };

    const chooseField = () => {
        if (field !== '' && field !== null && field !== undefined) {
            localStorage.setItem('domain', field);
            navigate('/');
            // console.log(localStorage.getItem('domain'));
        } else {
            setError('Kirjautuminen epäonnistui. \n Tarkista toimialue.');
        }
    };

    const handleKeyPress = (e: { code: string }) => {
        if (e.code === 'Enter' && field !== '') {
            chooseField();
        }
    };

    return (
        <>
            <div
                className="md:container md:mx-auto flex flex-wrap content-center justify-center bg-background-ig h-3/4"
                style={containerFull}
            >
                <div
                    style={backgroundContainer}
                    className="flex flex-col content-center justify-center items-stretch bg-white mobileKeyboard:-mt-12"
                >
                    {/* CHOOSE FIELD */}
                    <div className="h-1/3 bg-white">
                        <p className="text-center pt-10" style={secondaryTitle}>
                            AssisDent
                        </p>
                    </div>
                    <div style={fieldContainer} className="h-2/3 items-stretch">
                        {error !== '' ? (
                            <div className="content-center justify-center w-full bg-white -mt-6 pb-4">
                                <div className="content-center justify-center w-full">
                                    <div style={warningIconBackground}>
                                        <div
                                            className="text-center"
                                            style={warningIcon}
                                        >
                                            !
                                        </div>
                                    </div>
                                    <div
                                        className="text-center whitespace-pre-wrap pt-2"
                                        style={helperText}
                                    >
                                        {error}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        <p style={helpText} className="text-center pt-8">
                            Valitse toimialue
                        </p>

                        <div className="text-center pt-8">
                            <input
                                id="field"
                                placeholder="Toimialue"
                                style={inputField}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                type="text"
                                autoCorrect="off"
                                autoCapitalize="off"
                            ></input>
                        </div>
                        <div
                            className="text-center pt-8 pb-8"
                            style={fieldContainer}
                        >
                            <button
                                style={continueButton}
                                onClick={chooseField}
                            >
                                Jatka
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
