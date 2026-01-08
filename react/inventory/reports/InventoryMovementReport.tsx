import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { useInventoryMovementReport } from "../hooks/useInventoryMovementReport";

export const InventoryMovementReport: React.FC = () => {
    // Hook para obtener los datos del reporte
    const {
        reportData,
        loading,
        dateRange,
        setDateRange,
        // Los filtros se agregarán después
    } = useInventoryMovementReport();

    const [expandedRows, setExpandedRows] = useState<any>(null);
    const [totalMovements, setTotalMovements] = useState(0);
    const [totalDeposits, setTotalDeposits] = useState(0);

    useEffect(() => {
        calcularTotales(reportData);
    }, [reportData]);

    const calcularTotales = (datos: any[]) => {
        let totalMov = 0;
        let totalDep = datos.length;

        datos.forEach((deposit) => {
            totalMov += deposit.total_movements || 0;
        });

        setTotalMovements(totalMov);
        setTotalDeposits(totalDep);
    };

    // Formatear fecha
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // Template para expandir/contraer filas (mostrar movimientos del depósito)
    const rowExpansionTemplate = (deposit: any) => {
        return (
            <div className="p-3">
                <h5 className="mb-3">
                    Movimientos del Depósito: {deposit.deposit_name}
                </h5>
                <DataTable
                    value={deposit.movements}
                    size="small"
                    responsiveLayout="scroll"
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    emptyMessage="No hay movimientos para este depósito"
                >
                    <Column
                        field="movement_date"
                        header="Fecha Movimiento"
                        body={(rowData: any) =>
                            formatDate(rowData.movement_date)
                        }
                        sortable
                    />
                    <Column
                        field="type"
                        header="Tipo"
                        body={(rowData: any) => (
                            <span
                                className={`badge ${
                                    rowData.type === "entry"
                                        ? "bg-success"
                                        : "bg-warning"
                                }`}
                            >
                                {rowData.type === "entry"
                                    ? "ENTRADA"
                                    : "SALIDA"}
                            </span>
                        )}
                        sortable
                    />
                    <Column
                        field="quantity"
                        header="Cantidad"
                        body={(rowData: any) => (
                            <span
                                className={`fw-bold ${
                                    rowData.type === "entry"
                                        ? "text-success"
                                        : "text-danger"
                                }`}
                            >
                                {rowData.type === "entry" ? "+" : "-"}
                                {rowData.quantity}
                            </span>
                        )}
                        style={{ textAlign: "right" }}
                        sortable
                    />
                    <Column
                        header="Lote"
                        body={(rowData: any) =>
                            rowData.lot ? (
                                <div>{rowData.lot.lot_number}</div>
                            ) : (
                                "N/A"
                            )
                        }
                    />
                    <Column
                        header="Factura"
                        body={(rowData: any) =>
                            rowData.invoice ? (
                                <div>{rowData.invoice.invoice_code}</div>
                            ) : (
                                "N/A"
                            )
                        }
                    />
                    <Column
                        header="Usuario"
                        body={(rowData: any) =>
                            rowData.user ? (
                                <div>{rowData.user.full_name}</div>
                            ) : (
                                "N/A"
                            )
                        }
                    />
                    <Column
                        header="Depósito Relacionado"
                        body={(rowData: any) =>
                            rowData.related_deposit ? (
                                <div>
                                    <div className="fw-bold">
                                        {rowData.related_deposit.name}
                                    </div>
                                    <small className="text-muted">
                                        {rowData.related_deposit.type}
                                    </small>
                                </div>
                            ) : (
                                "N/A"
                            )
                        }
                    />
                </DataTable>
            </div>
        );
    };

    // Template para el tipo de depósito
    const depositTypeTemplate = (rowData: any) => {
        let badgeClass = "bg-secondary";
        let typeText = rowData.deposit_type;

        if (rowData.deposit_type === "PHARMACY") {
            badgeClass = "bg-info";
            typeText = "Farmacia";
        } else if (rowData.deposit_type === "WAREHOUSE") {
            badgeClass = "bg-warning";
            typeText = "Bodega";
        } else if (rowData.deposit_type === "CLINIC") {
            badgeClass = "bg-primary";
            typeText = "Clínica";
        }

        return <span className={`badge ${badgeClass}`}>{typeText}</span>;
    };

    // Template para estado del depósito
    const statusTemplate = (rowData: any) => {
        return (
            <span
                className={`badge ${
                    rowData.is_active ? "bg-success" : "bg-danger"
                }`}
            >
                {rowData.is_active ? "Activo" : "Inactivo"}
            </span>
        );
    };

    // Footer para los totales
    const footerTotales = (
        <div className="grid">
            <div className="col-12 md:col-4">
                <strong>Total Depósitos:</strong> {totalDeposits}
            </div>
            <div className="col-12 md:col-4">
                <strong>Total Movimientos:</strong> {totalMovements}
            </div>
            <div className="col-12 md:col-4">
                <strong>Última actualización:</strong>{" "}
                {new Date().toLocaleDateString("es-ES")}
            </div>
        </div>
    );

    return (
        <div className="container-fluid mt-4" style={{ padding: "0 15px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Reporte de Movimientos de Inventario</h2>
                {/* Aquí irán los botones de exportación cuando los agreguemos */}
            </div>

            {/* Tabla de resultados */}
            <Card className="shadow-sm">
                <DataTable
                    value={reportData}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    emptyMessage="No se encontraron depósitos con movimientos"
                    className="p-datatable-striped p-datatable-gridlines"
                    responsiveLayout="scroll"
                    footer={footerTotales}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="deposit_id"
                >
                    <Column expander style={{ width: "3em" }} />
                    <Column
                        field="deposit_id"
                        header="ID Depósito"
                        sortable
                        style={{ width: "100px" }}
                    />
                    <Column
                        field="deposit_name"
                        header="Nombre Depósito"
                        sortable
                    />
                    <Column
                        field="deposit_type"
                        header="Tipo"
                        body={depositTypeTemplate}
                        sortable
                    />
                    <Column
                        field="is_active"
                        header="Estado"
                        body={statusTemplate}
                        sortable
                    />
                    <Column
                        field="total_movements"
                        header="N° Movimientos"
                        body={(rowData: any) => (
                            <span
                                className={`badge ${
                                    rowData.total_movements > 0
                                        ? "bg-primary"
                                        : "bg-secondary"
                                }`}
                            >
                                {rowData.total_movements}
                            </span>
                        )}
                        style={{ textAlign: "center", width: "120px" }}
                        sortable
                    />
                    <Column
                        header="Último Movimiento"
                        body={(rowData: any) => {
                            if (
                                !rowData.movements ||
                                rowData.movements.length === 0
                            ) {
                                return "Sin movimientos";
                            }
                            const lastMovement = rowData.movements[0]; // Ya están ordenados por fecha descendente
                            return (
                                <div>
                                    <div className="small">
                                        {formatDate(lastMovement.movement_date)}
                                    </div>
                                    <div
                                        className={`small ${
                                            lastMovement.type === "entry"
                                                ? "text-success"
                                                : "text-danger"
                                        }`}
                                    >
                                        {lastMovement.type === "entry"
                                            ? "Entrada"
                                            : "Salida"}
                                        : {lastMovement.quantity}
                                    </div>
                                </div>
                            );
                        }}
                        style={{ width: "150px" }}
                    />
                </DataTable>
            </Card>

            {/* Resumen general */}
            <div className="row mt-4">
                <div className="col-md-3 mb-3">
                    <Card className="h-100">
                        <div className="text-center">
                            <h5 className="text-muted">Depósitos Activos</h5>
                            <h3 className="text-success">
                                {reportData.filter((d) => d.is_active).length}
                            </h3>
                        </div>
                    </Card>
                </div>
                <div className="col-md-3 mb-3">
                    <Card className="h-100">
                        <div className="text-center">
                            <h5 className="text-muted">Total Entradas</h5>
                            <h3 className="text-success">
                                {reportData.reduce((acc, deposit) => {
                                    const entries =
                                        deposit.movements?.filter(
                                            (m) => m.type === "entry"
                                        ).length || 0;
                                    return acc + entries;
                                }, 0)}
                            </h3>
                        </div>
                    </Card>
                </div>
                <div className="col-md-3 mb-3">
                    <Card className="h-100">
                        <div className="text-center">
                            <h5 className="text-muted">Total Salidas</h5>
                            <h3 className="text-danger">
                                {reportData.reduce((acc, deposit) => {
                                    const exits =
                                        deposit.movements?.filter(
                                            (m) =>
                                                m.type === "exit" ||
                                                m.type === "out"
                                        ).length || 0;
                                    return acc + exits;
                                }, 0)}
                            </h3>
                        </div>
                    </Card>
                </div>
                <div className="col-md-3 mb-3">
                    <Card className="h-100">
                        <div className="text-center">
                            <h5 className="text-muted">
                                Total Cantidad Movida
                            </h5>
                            <h3 className="text-primary">
                                {reportData.reduce((acc, deposit) => {
                                    const totalQty =
                                        deposit.movements?.reduce((sum, m) => {
                                            return sum + (m.quantity || 0);
                                        }, 0) || 0;
                                    return acc + totalQty;
                                }, 0)}
                            </h3>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
