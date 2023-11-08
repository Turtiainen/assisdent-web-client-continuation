import { useNavigate } from 'react-router-dom';
import {
    backImage,
    forwardImage,
    refreshImage,
    helpImage,
    minimizeImage,
    maximizeImage,
    closeImage,
} from '../assets/ExportImages';

export const BackwardForwardNavigation = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // navigate one step backward in the browser's history
    };

    const goForward = () => {
        navigate(1); // navigate one step forward in the browser's history
    };

    return (
        <div className="flex top-0 left-0 right-0 p-1 z-99 border-b-2 border-solid border-indigo-500">
            <div className="flex justify-start">
                <button
                    onClick={goBack}
                    className="flex items-center justify-center hover:bg-gray-200 rounded-full w-8 h-8"
                >
                    <img
                        src={backImage}
                        className="h-3.5 w-5"
                        alt="Go Back Icon"
                    />
                </button>
                <button
                    onClick={goForward}
                    className="flex items-center justify-center hover:bg-gray-200 rounded-full w-8 h-8"
                >
                    <img
                        src={forwardImage}
                        className="h-3.5 w-5"
                        alt="Go Forward Icon"
                    />
                </button>
                <button
                    onClick={() => console.log('refresh')}
                    className="flex items-center justify-center hover:bg-gray-200 rounded-full w-8 h-8"
                >
                    <img
                        src={refreshImage}
                        className="h-3.5 w-5"
                        alt="Refresh Icon"
                    />
                </button>
            </div>

            <div className="flex absolute right-1">
                <button
                    onClick={() => console.log('Help')}
                    className="flex items-center justify-center hover:bg-gray-200 rounded-full w-8 h-8"
                >
                    <img
                        src={helpImage}
                        className="h-3.5 w-5"
                        alt="Help Icon"
                    />
                </button>
                <button
                    onClick={() => console.log('Minimize')}
                    className="flex items-center justify-center hover:bg-gray-200 rounded-full w-8 h-8"
                >
                    <img
                        src={minimizeImage}
                        className="h-3.5 w-5"
                        alt="Minimize Icon"
                    />
                </button>
                <button
                    onClick={() => console.log('Maximize')}
                    className="flex items-center justify-center hover:bg-gray-200 rounded-full w-8 h-8"
                >
                    <img
                        src={maximizeImage}
                        className="h-3.5 w-5"
                        alt="Maximize Icon"
                    />
                </button>
                <button
                    onClick={() => console.log('Close')}
                    className="flex items-center justify-center hover:bg-gray-200 rounded-full w-8 h-8"
                >
                    <img
                        src={closeImage}
                        className="h-3.5 w-5"
                        alt="Close Icon"
                    />
                </button>
            </div>
        </div>
    );
};
