interface SidebarFooterProps {
    isSidebarExpanded: boolean;
}

export const SidebarFooter = ({ 
    isSidebarExpanded }: SidebarFooterProps) => {
    
    return (
        <div className="sidebar-footer">
            {isSidebarExpanded 
                ?   (
                    <>
                        <button className="icon" onClick={() => console.log("Käyttöohje")}>?</button>
                        <button className="icon">⚙️</button>
                        <button className="icon">A</button>
                        <button className="icon">Ô</button>
                    </>
                    )
                :   (
                        <button className="icon">+</button>
                    )
            }
        </div>
    )
}