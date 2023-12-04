import {
    continueButton,
    backgroundContainer,
    secondaryTitle,
    chosenField,
    textTip,
    inputField,
    helperText,
    containerFull,
    warningIcon,
    warningIconBackground,
    backgroundExtender,
} from '../styles/globalStyles';
import { useNavigate } from 'react-router-dom';
import {
    ChangeEvent,
    KeyboardEventHandler,
    useEffect,
    useRef,
    useState,
} from 'react';
import { doLogin } from '../services/backend';
import { showing, hiding, backImage } from '../assets/ExportImages';

export const LoginWithCredentials = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);
    const errorText =
        'Kirjautuminen epäonnistui. \n Tarkista käyttäjätunnus ja salasana.';
    const fieldText = () => {
        return localStorage.getItem('domain');
    };

    const emptyFieldSelection = () => {
        localStorage.removeItem('domain');
        navigate('/login');
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    useEffect(() => {
        const field = localStorage.getItem('domain');
        if (field === undefined || field === '' || field === null)
            emptyFieldSelection();
        // if (process.env.NODE_ENV === 'development') {
        //     doLogin(
        //         import.meta.env.VITE_ASSISCARE_USER,
        //         import.meta.env.VITE_ASSISCARE_PASS,
        //     );
        //     navigate('/');
        // }
    }, [emptyFieldSelection, doLogin]);

    const handleLogin = async () => {
        if (username !== '' && username !== null && username !== undefined)
            if (
                password !== '' &&
                password !== null &&
                password !== undefined
            ) {
                setError('Doing login...');
                const result = await doLogin(username, password);
                if (typeof result === 'string')
                    if (result.startsWith('error')) {
                        setError(errorText);
                        return false;
                    }
                navigate('/');
            } else setError(errorText);
        else setError(errorText);
    };

    const handleKeyPress = (e: { code: string }) => {
        if (e.code === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div
            className="md:container md:mx-auto flex flex-wrap content-center justify-center bg-background-ig h-3/4"
            style={containerFull}
        >
            <div
                style={backgroundContainer}
                className="flex flex-col content-center justify-center items-stretch bg-white"
            >
                {/* LOGIN WITH CREDENTIALS */}
                <div className="h-1/3">
                    <p className="text-center pt-10" style={secondaryTitle}>
                        AssistDent
                    </p>
                    <p
                        className="text-center pt-4"
                        style={chosenField}
                        onClick={emptyFieldSelection}
                    >
                        &lt; Toimialue: {fieldText()}
                    </p>
                </div>
                <div className="h-2/3">
                    {error !== '' ? (
                        <div className="content-center justify-center w-full">
                            <div className="content-center justify-center w-full pb-2">
                                <div style={warningIconBackground}>
                                    <div
                                        className="text-center"
                                        style={warningIcon}
                                    >
                                        !
                                    </div>
                                </div>
                            </div>
                            <div
                                className="text-center whitespace-pre-wrap"
                                style={helperText}
                            >
                                {error}
                            </div>
                        </div>
                    ) : null}
                    <div className="text-center pt-6">
                        <input
                            placeholder="Käyttäjätunnus"
                            style={inputField}
                            onChange={handleUsernameChange}
                            onKeyPress={handleKeyPress}
                            autoCorrect="off"
                            autoCapitalize="off"
                            type="text"
                            autoFocus
                        ></input>
                    </div>
                    <div className="text-center pt-2 relative flex">
                        <input
                            ref={passwordInput}
                            placeholder="Salasana"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            style={inputField}
                            onChange={handlePasswordChange}
                            onKeyPress={handleKeyPress}
                            autoCorrect="off"
                            autoCapitalize="off"
                            className="pr-40 m-auto"
                        ></input>
                        <img
                            src={showPassword ? showing : hiding}
                            onClick={() => setShowPassword(!showPassword)}
                            alt={
                                showPassword ? 'Hide password' : 'Show password'
                            }
                            className="absolute w-6 right-12 cursor-pointer mt-1"
                        />
                    </div>
                    <div style={backgroundExtender}>
                        <div className="text-center pt-8 pb-2">
                            <button
                                style={continueButton}
                                onClick={handleLogin}
                            >
                                Jatka
                            </button>
                        </div>
                        {/*<div className="pt-2 pb-4 mobile:hidden">*/}
                        {/*    <p style={textTip} className="text-center">*/}
                        {/*        tai syötä varmennekortti lukijaan*/}
                        {/*    </p>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    );
};
