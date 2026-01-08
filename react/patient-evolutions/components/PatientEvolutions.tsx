import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { CustomPRTable } from "../../components/CustomPRTable";
import { DynamicForm } from "../../dynamic-form/components/DynamicForm";
import { tableFilters } from "../config/table-filters";
import { userService } from "../../../services/api";

export const PatientEvolutions = () => {

    const handleFiltersChange = (data: any) => {
        console.log(data);
    }

    const sourceData = {
        "doctors": async (params: any) => {
            return userService.getAllUsers()
        }
    }

    return (<>
        <DynamicForm config={tableFilters} onSubmit={() => { }} onChange={handleFiltersChange} sources={sourceData} />

        {/* <CustomPRTable
                                columns={columns}
                                data={tableItems}
                                lazy={lazy}
                                first={first}
                                rows={rows}
                                totalRecords={totalRecords}
                                loading={loading}
                                onPage={onPage}
                                onSearch={onSearch}
                                onReload={onReload}
                            /> */}
    </>);
};