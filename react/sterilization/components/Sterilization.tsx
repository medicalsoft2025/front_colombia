import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { PackagesTab } from './packages/PackagesTab';
import { LoadsTab } from './loads/LoadsTab';

export const Sterilization = () => {
    return (
        <div className="card m-3">
            <div className="card-body">
                <TabView>
                    <TabPanel header="Cargas">
                        <LoadsTab />
                    </TabPanel>
                    <TabPanel header="Paquetes">
                        <PackagesTab />
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
};