import { useState } from "react";

import { SidebarItems } from "./SidebarItems";
import { SidebarFooter } from "./SidebarFooter";


export const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    const exampleSidebarItems = [
        {
            text: "Valikko",
            icon: "🍔",
            onClick: () => console.log("Valikko"),
            isExpanded: isExpanded,
        },
        {
            text: "Haku",
            icon: "🔍",
            onClick: () => console.log("Haku"),
            isExpanded: isExpanded,
        },
    ];

    const exampleSidebarSubContent = [
        {
            text: "Matti Meikäläinen",
            icon: "👨‍💻",
            onClick: () => console.log("Matti Meikäläinen"),
            isExpanded: isExpanded,
        },
        {
            text: "Tänään Xx x.x.xxxx",
            icon: "📅",
            onClick: () => console.log("Tänään Xx x.x.xxxx"),
            isExpanded: isExpanded,
        },
        {
            text: "Keskeneräiset",
            icon: "0",
            onClick: () => console.log("Keskeneräiset"),
            isExpanded: isExpanded,
        },
        {
            text: "Viestit ja kommentit",
            icon: "💬",
            onClick: () => console.log("Viestit ja kommentit"),
            isExpanded: isExpanded,
        },
        {
            text: "Työjono",
            icon: "📝",
            onClick: () => console.log("Työjono"),
            isExpanded: isExpanded,
        },
        {
            text: "Työtila",
            icon: "🏢",
            onClick: () => console.log("Työtila"),
            isExpanded: isExpanded,
        },
    ];

    return (
        <div className="sidebar-container">
            <div className="sidebar-header-wrapper">
            {isExpanded 
                ? <a href='/'>AssisDent</a> 
                : ""
            }
            <button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "<-" : "->"}
            </button>
            </div>
            <SidebarItems title="" content={exampleSidebarItems} isExpanded={isExpanded} />
            <SidebarItems title="OMAT TIEDOT" content={exampleSidebarSubContent} isExpanded={isExpanded} />
            <SidebarFooter isSidebarExpanded={isExpanded} />
        </div>
    )
}