import React from 'react';

/**
 * Interface representing a programmatically registered sidebar item.
 * @template P - The type of props passed to the associated component.
 */
export interface SideBarItem<P = Record<string, any>> {
    /** Unique identifier for the sidebar item */
    id: string;

    /** Icon element displayed in the sidebar rail (e.g. <InfoOutlinedIcon />) */
    icon: React.ReactNode;

    /** Tooltip text displayed on hover */
    tooltip: string;

    /** Header title displayed in the expanded panel header (defaults to tooltip if omitted) */
    title?: string;

    /** The React component associated with this sidebar item */
    component: React.ComponentType<P>;

    /** The props passed to the component, determined at register time */
    props?: P;
}

