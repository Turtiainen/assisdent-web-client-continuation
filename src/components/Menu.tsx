import { MenuSection } from './MenuSection';

import { closeMenuImage } from '../assets/ExportImages';

type MenuProps = {
    onClick: () => void;
};

export const Menu = ({ onClick }: MenuProps) => {
    return (
        <div className="min-h-[100vh] max-h-screen w-80 bg-ad-gray-300 left-64 shadow-md overflow-x-hidden overflow-y-hidden left-0 bottom-0 top-0">
            <div className="col-span-1 mx-1">
                <div className="w-full inline-flex justify-between py-2 mb-4">
                    <div className="px-3 text-ad-hero-title text-sm">
                        Valikko
                    </div>
                    <button className="px-2" onClick={onClick}>
                        <div className="h-2 w-5">
                            <img src={closeMenuImage} alt="Close Icon" />
                        </div>
                    </button>
                </div>
                <div className="px-3">
                    <MenuSection
                        title="POTILAAT"
                        items={[
                            {
                                text: 'Ajanvaraukset',
                                onClick: () => console.log('Ajanvaraukset'),
                                linkTo: '/view/AppointmentRegisterView',
                            },
                            {
                                text: 'Jatko-ohjeet',
                                onClick: () => console.log('Jatko-ohjeet'),
                                linkTo: '/view/FollowupInstructionRegisterView',
                            },
                            {
                                text: 'Kutsut',
                                onClick: () => console.log('Kutsut'),
                                linkTo: '/view/RecallRegisterView',
                            },
                            {
                                text: 'Potilaat',
                                onClick: () => console.log('Potilaat'),
                                linkTo: '/view/PatientRegisterView',
                            },
                        ]}
                        onClick={() => console.log('POTILAAT')}
                        button={
                            <button className="bg-blue-500 hover-bg-blue-600 text-white text-sm w-full py-1 my-2 rounded">
                                Luo uusi potilas
                            </button>
                        }
                    />

                    <MenuSection
                        title="TALOUS"
                        items={[]}
                        onClick={() => console.log('TALOUS')}
                    />
                    <MenuSection
                        title="RAPORTIT JA TILASTOINTI"
                        items={[]}
                        onClick={() => console.log('RAPORTIT JA TILASTOINTI')}
                    />
                    <MenuSection
                        title="ORGANISAATIO"
                        items={[]}
                        onClick={() => console.log('ORGANISAATIO')}
                    />
                </div>
            </div>
        </div>
    );
};
