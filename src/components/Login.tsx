import { titleText } from '../styles/globalStyles';
import { FieldChoice } from './FieldChoice';
import { LoginWithCredentials } from './LoginWithCredentials';

export const Login = () => {
    const hasDomain = () => {
        return localStorage.getItem('domain') !== null;
    };

    return (
        <div className="h-screen grid-flow-col grid-cols-1 mobileKeyboard:bg-background-ig bg-background-blue bg-cover">
            <div className="md:container md:mx-auto h-1/6 justify-center content-center flex mobileKeyboard:bg-background-ig">
                <div className="flex flex-wrap mobileKeyboard:hidden">
                    <p style={titleText}>AssisDent</p>
                </div>
            </div>
            {hasDomain() ? <LoginWithCredentials /> : <FieldChoice />}
        </div>
    );
};
