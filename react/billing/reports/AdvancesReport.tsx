import React, { useCallback, useEffect, useRef, useState } from "react";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { CSSProperties } from "react";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { ThirdPartyDropdown } from "../../fields/dropdowns/ThirdPartyDropdown";
import { formatDateRange, formatPrice } from "../../../services/utilidades";
import {
    ThirdPartyAdvance,
} from "./hooks/useAdvancesReport";
import { useAdvancesReportFormat } from "../../documents-generation/hooks/useAdvancesReportFormat";
import { CustomPRTable } from "../../components/CustomPRTable";
import { useDataPagination } from "../../hooks/useDataPagination";
import { BillingReportService } from "../../../services/api/classes/billingReportService";
import { Toast } from "primereact/toast";

interface AdvancesReportProps {
    fetchData?: (startDate: string, endDate: string) => Promise<any[]>;
}

export const AdvancesReport: React.FC<AdvancesReportProps> = () => {
    const toast = useRef<Toast>(null);
    const [reportType, setReportType] = useState<"client" | "provider">("client");
    const { generarFormatoAdvancesReport } = useAdvancesReportFormat();
    
    const [filtros, setFiltros] = useState({
        dateRange: [new Date(), new Date()] as (Date | null)[],
        thirdPartyId: null as string | null,
    });

    const {
        data: advancesReport,
        loading: loadingPaginator,
        first,
        perPage,
        totalRecords,
        handlePageChange,
        handleSearchChange,
        refresh,
    } = useDataPagination({
        fetchFunction: (params) => loadAdvancesReport(params),
        defaultPerPage: 10,
    });

    async function loadAdvancesReport(params: any = { perPage: 10 }) {
        const service = new BillingReportService();
        
        const backendFilters: any = {
            ...params,
            sort: "-id",
        };

        if (filtros.dateRange && Array.isArray(filtros.dateRange)) {
            const fechaArray = filtros.dateRange as any[];
            if (fechaArray.length >= 2) {
                const startDate = fechaArray[0];
                const endDate = fechaArray[1];

                if (startDate && typeof startDate.toISOString === "function") {
                    backendFilters.start_date = startDate.toISOString().split("T")[0];
                }
                if (endDate && typeof endDate.toISOString === "function") {
                    backendFilters.end_date = endDate.toISOString().split("T")[0];
                }
            }
        }

        if (filtros.thirdPartyId) {
            backendFilters.third_party_id = filtros.thirdPartyId;
        }

        if (params.search && params.search.trim() !== "") {
            backendFilters.search = params.search.trim();
        }

        const response = await service.getAdvancesReportByType(backendFilters, {type: reportType});

        return {
            data: response.data.data || response.data || [],
            total: response.data.total || (response.data.length || 0),
        };
    }

    const handleFilterChange = (field: string, value: any) => {
        setFiltros((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const limpiarFiltros = () => {
        setFiltros({
            dateRange: [new Date(), new Date()],
            thirdPartyId: null,
        });
    };

    useEffect(() => {
        refresh();
    }, [reportType]);

    useEffect(() => {
        if (
            filtros.dateRange?.[0] === null &&
            filtros.dateRange?.[1] === null &&
            filtros.thirdPartyId === null
        ) {
            refresh();
        }
    }, [filtros]);

    const formatMovementType = (type: string) => {
        return type === "income" ? "Ingreso" : "Egreso";
    };

    const getTypeBadgeClass = (type: string) => {
        return type === "income" ? "bg-success" : "bg-danger";
    };

    const formatMovementStatus = (status: string) => {
        const statusMap: { [key: string]: string } = {
            pending: "Pendiente",
            approved: "Aprobado",
            applied: "Aplicado",
            cancelled: "Cancelado",
        };
        return statusMap[status] || status;
    };

    const getStatusBadgeClass = (status: string) => {
        const statusClasses: { [key: string]: string } = {
            pending: "bg-warning",
            approved: "bg-success",
            applied: "bg-info",
            cancelled: "bg-danger",
        };
        return statusClasses[status] || "bg-secondary";
    };

    // Columnas para la tabla principal
    const mainColumns = [
        {
            field: "third_party.name",
            header: "Nombre",
            body: (rowData: ThirdPartyAdvance) =>
                rowData.third_party?.name || "Sin nombre",
        },
        {
            field: "third_party.document_number",
            header: "Documento",
            body: (rowData: ThirdPartyAdvance) =>
                rowData.third_party?.document_number || "Sin documento",
        },
        {
            field: "third_party.email",
            header: "Email",
            body: (rowData: ThirdPartyAdvance) =>
                rowData.third_party?.email || "Sin email",
        },
        {
            field: "amount",
            header: "Monto",
            body: (rowData: ThirdPartyAdvance) => formatPrice(rowData.amount),
            style: { textAlign: "right" } as CSSProperties,
        },
        {
            field: "currency",
            header: "Moneda",
        },
        {
            field: "type",
            header: "Tipo",
            body: (rowData: ThirdPartyAdvance) => (
                <span className={`badge ${getTypeBadgeClass(rowData.type)}`}>
                    {formatMovementType(rowData.type)}
                </span>
            ),
        },
        {
            field: "status",
            header: "Estado",
            body: (rowData: ThirdPartyAdvance) => (
                <span
                    className={`badge ${getStatusBadgeClass(rowData.status)}`}
                >
                    {formatMovementStatus(rowData.status)}
                </span>
            ),
        },
        {
            field: "reference",
            header: "Referencia",
        },
        {
            field: "created_at",
            header: "Fecha Creación",
            body: (rowData: ThirdPartyAdvance) =>
                new Date(rowData.created_at).toLocaleDateString(),
        },
    ];

    const exportToPdf = () => {
        generarFormatoAdvancesReport(
            advancesReport,
            formatDateRange(filtros.dateRange),
            "Impresion"
        );
    };

    const handleReload = () => {
        refresh();
    };

    const handleTypeChange = (type: "client" | "provider") => {
        setReportType(type);
    };

    const renderTypeSelector = () => (
        <div className="row g-3 mb-3">
            <div className="col-md-12">
                <label className="form-label">Tipo de Reporte</label>
                <div className="d-flex gap-2">
                    <Button
                        label="Anticipos de Clientes"
                        icon="pi pi-users"
                        className={
                            reportType === "client"
                                ? "p-button-primary"
                                : "p-button-outlined"
                        }
                        onClick={() => handleTypeChange("client")}
                    />
                    <Button
                        label="Anticipos de Proveedores"
                        icon="pi pi-building"
                        className={
                            reportType === "provider"
                                ? "p-button-primary"
                                : "p-button-outlined"
                        }
                        onClick={() => handleTypeChange("provider")}
                    />
                </div>
            </div>
        </div>
    );

    const renderFiltersAccordion = () => (
        <Accordion className="mb-3">
            <AccordionTab
                header={
                    <div className="d-flex align-items-center">
                        <i className="fas fa-filter me-2"></i>
                        Filtros - Reporte de Anticipos{" "}
                        {reportType === "client" ? "Clientes" : "Proveedores"}
                    </div>
                }
            >
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="dateRange" className="form-label">
                            Rango de fechas
                        </label>
                        <Calendar
                            id="dateRange"
                            selectionMode="range"
                            value={filtros.dateRange}
                            onChange={(e) => handleFilterChange("dateRange", e.value)}
                            className="w-100"
                            showIcon
                            dateFormat="dd/mm/yy"
                            placeholder="Seleccione un rango"
                        />
                    </div>
                    <div className="col-md-6">
                        <ThirdPartyDropdown
                            value={filtros.thirdPartyId}
                            handleChange={(e: any) => handleFilterChange("thirdPartyId", e.value)}
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button
                        label="Limpiar Filtros"
                        icon="pi pi-trash"
                        className="p-button-secondary"
                        onClick={limpiarFiltros}
                    />
                    <Button
                        label="Aplicar Filtros"
                        icon="pi pi-filter"
                        className="p-button-primary"
                        onClick={handleReload}
                        loading={loadingPaginator}
                    />
                </div>
            </AccordionTab>
        </Accordion>
    );

    return (
        <main className="main" id="top">
            <Toast ref={toast} />
            <div className="row g-3 justify-content-between align-items-start mb-4">
                <div className="col-12">
                    <div
                        className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                        style={{ minHeight: "400px" }}
                    >
                        <div className="card-body h-100 w-100 d-flex flex-column">
                            <div className="tabs-professional-container">
                                <div className="tabs-header">
                                    <button className="tab-item active">
                                        <i className="fas fa-hand-holding-usd"></i>
                                        Reporte de Anticipos -{" "}
                                        {reportType === "client"
                                            ? "Clientes"
                                            : "Proveedores"}
                                    </button>
                                </div>

                                <div className="tabs-content">
                                    <div className="tab-panel active">
                                        <div className="d-flex justify-content-end mb-3">
                                            <Button
                                                icon={
                                                    <i className="fas fa-file-pdf me-2"></i>
                                                }
                                                label="Exportar a PDF"
                                                className="p-button-primary"
                                                onClick={exportToPdf}
                                            />
                                        </div>

                                        {renderTypeSelector()}
                                        {renderFiltersAccordion()}

                                        <Card
                                            title={`Reporte de Anticipos - ${
                                                reportType === "client"
                                                    ? "Clientes"
                                                    : "Proveedores"
                                            }`}
                                            className="mb-3"
                                        >
                                            <CustomPRTable
                                                columns={mainColumns}
                                                data={advancesReport}
                                                lazy
                                                first={first}
                                                rows={perPage}
                                                totalRecords={totalRecords}
                                                loading={loadingPaginator}
                                                onPage={handlePageChange}
                                                onSearch={handleSearchChange}
                                                onReload={() => refresh()}
                                            />
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};