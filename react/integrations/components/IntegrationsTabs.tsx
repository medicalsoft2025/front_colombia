import React from "react";

interface IntegrationsTabsProps {
    tabs: {
        id: string;
        label: string;
        icon: string;
        content: React.ReactNode;
    }[];
}

export const IntegrationsTabs = (props: IntegrationsTabsProps) => {
    const { tabs } = props;
    return (
        <>
            <div className="row gx-3 gy-4 mb-5">
                <div className="card mb-3 p-3">
                    <div className="row">
                        <ul className="nav nav-underline fs-9 flex-column col-md-4 mx-3" id="tabs-typeMessages" role="tablist">
                            {tabs.map((tab) => (<>
                                <li key={tab.id} className="nav-item" role="presentation">
                                    <button
                                        className="nav-link"
                                        id={tab.id}
                                        data-bs-toggle="tab"
                                        data-bs-target={`#${tab.id}-pane`}
                                        type="button"
                                        role="tab"
                                        aria-controls={`#${tab.id}-pane`}
                                        aria-selected="true"
                                    >
                                        <i className={tab.icon}></i> {tab.label}
                                    </button>
                                </li>
                            </>))}
                        </ul>

                        <div className="tab-content col-md-8 flex-grow-1" id="typeMessages-tabContent">

                            {tabs.map((tab) => (<>
                                <div
                                    key={`#${tab.id}-pane`}
                                    className="tab-pane fade show"
                                    id={`${tab.id}-pane`}
                                    role="tabpanel"
                                    aria-labelledby={`${tab.id}-pane`}
                                >
                                    {tab.content}
                                </div>
                            </>))}
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {
                    `
                #tabs-typeMessages {
                    min-width: 200px;
                    max-width: 250px;
                }
                #tabs-typeMessages .nav-link {
                    width: 100%;
                    text-align: left;
                }
                `
                }
            </style>
        </>
    );
};