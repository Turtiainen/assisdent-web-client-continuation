import { ChangeEventHandler, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DtoSchema } from '../types/DtoSchema';
import useSchemaStore from '../store/store';
import { SchemaStore } from '../types/SchemaStore';

export type SubSidebarSearchType = {
    onClick: () => void;
};

export const SubSidebarSearch = ({ onClick }: SubSidebarSearchType) => {
    const schemaInStore = useSchemaStore((state: SchemaStore) => state.schema);

    const [filter, setFilter] = useState<string | null>(null);
    const navigate = useNavigate();
    const filterDocuments: ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        if (e.target.value === '') setFilter(null);
        else setFilter(e.target.value);
    };

    // Force type conversion to DtoSchema
    const data = schemaInStore as DtoSchema;
    const xmlParser = new DOMParser();
    const MetaViews = data.MetaViews;
    const viewList: {
        ViewName: string;
        ViewHeader: string;
        ViewDefinitionCoreBase: Element;
    }[] = [];

    let MetaViewXmlList = MetaViews.map((MetaView) =>
        xmlParser.parseFromString(MetaView.XML, 'text/xml'),
    );

    if (filter && filter.length > 1) {
        MetaViewXmlList = MetaViewXmlList.filter((doc: Document) => {
            return doc
                ?.getElementsByTagName('ViewDefinitionCoreBase')[0]
                ?.getAttribute('Header')
                ?.toLowerCase()
                ?.includes(filter.toLowerCase());
        });
    }

    MetaViewXmlList.sort((a, b) => {
        const aName = a.firstElementChild!.getAttribute('Header')!;
        const bName = b.firstElementChild!.getAttribute('Header')!;
        if (aName === bName) return 0;
        return aName < bName ? -1 : 1;
    });

    MetaViewXmlList.forEach((doc) => {
        const ViewDefinitionCoreBase = doc.firstElementChild!;
        if (
            ViewDefinitionCoreBase.getAttribute('Name')!.includes(
                'RegisterView',
            )
        ) {
            const ViewName = ViewDefinitionCoreBase.getAttribute('Name')!;
            const ViewHeader = ViewDefinitionCoreBase.getAttribute('Header')!;
            viewList.push({
                ViewName,
                ViewHeader,
                ViewDefinitionCoreBase,
            });
        }
    });

    const Print = (
        <>
            {viewList && viewList.length === 0 && (
                <p className="text-sm text-gray-500">Ei hakutuloksia</p>
            )}
            {viewList.map((obj) => {
                return (
                    <div
                        key={obj.ViewName}
                        className="w-80"
                        data-testid="search-result-item"
                        onClick={() => {
                            onClick();
                            navigate(`/view/${obj.ViewName}`);
                        }}
                    >
                        {obj.ViewHeader}
                    </div>
                );
            })}
        </>
    );
    return (
        <div className="min-h-[100vh] w-80 bg-ad-gray-300 left-64 shadow-md overflow-x-hidden overflow-y-hidden">
            <div className="col-span-1">
                <div className="w-full inline-flex justify-between py-2">
                    <div className="px-2 text-ad-hero-title text-sm">Haku</div>
                    <button className="px-2" onClick={onClick}>
                        X
                    </button>
                </div>
                <div className="flex px-2">
                    <input
                        type="text"
                        className="w-full h-7 px-3 text-base placeholder-gray-600 border border-ad-grey-400 rounded-sm py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none"
                        placeholder="Kirjoita hakusana 🔍"
                        onChange={filterDocuments}
                    />
                </div>
            </div>
            <div
                className="flex-row justify-left items-top px-2 py-2"
                data-testid="search-results"
            >
                {!filter && (
                    <p className="text-sm text-gray-500">
                        Etsi rekisterinäkymiä
                    </p>
                )}
                {filter && filter.length < 2 && (
                    <p className="text-sm text-gray-500">
                        Syötä lisää merkkejä...
                    </p>
                )}
                {filter && filter.length > 1 && <>{Print}</>}
            </div>
        </div>
    );
};
