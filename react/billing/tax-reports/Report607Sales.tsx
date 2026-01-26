import React, { useCallback, useEffect, useRef, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { invoiceService } from "../../../services/api";
import { Toast } from "primereact/toast";
import { PrimeReactProvider } from "primereact/api";
import { CustomPRTable } from "../../components/CustomPRTable";
import { useDataPagination } from "../../hooks/useDataPagination";
import { Tag } from "primereact/tag";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useThirdParties } from "../../billing/third-parties/hooks/useThirdParties";
export const Report607Sales: React.FC<any> = () => {
  const toast = useRef<Toast>(null);
  const { thirdParties } = useThirdParties();
  const [filtros, setFiltros] = useState({
    numeroFactura: "",
    cliente: null,
    fechaRango: null,
    estado: null,
  });
  const {
    data: consentsData,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataPagination({
    fetchFunction: (params) => loadFormat606Sales(params),
    defaultPerPage: 10,
  });

  async function loadFormat606Sales(params: any = { perPage: 10 }) {
    const backendFilters: any = {
      ...params,
      type: "sale",
      sort: "-id",
    };

    if (filtros.numeroFactura && filtros.numeroFactura.trim() !== "") {
      backendFilters.document_number = filtros.numeroFactura.trim();
    }

    if (filtros.cliente) {
      backendFilters.third_party_id = filtros.cliente;
    }

    if (filtros.fechaRango && Array.isArray(filtros.fechaRango)) {
      const fechaArray = filtros.fechaRango as any[];
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

    if (filtros.estado) {
      backendFilters.status = filtros.estado;
    }

    if (params.search && params.search.trim() !== "") {
      backendFilters.search = params.search.trim();
    }

    const data = await invoiceService.taxReportFormats(backendFilters);

    return {
      data: data.data.data,
      total: data.data.total || 0,
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
      numeroFactura: "",
      cliente: null,
      fechaRango: null,
      estado: null,
    });
  };

  useEffect(() => {
    if (
      filtros.numeroFactura === "" &&
      filtros.cliente === null &&
      filtros.fechaRango === null &&
      filtros.estado === null
    ) {
      // Si todos los filtros están limpios, refrescar para obtener datos sin filtros
      refresh();
    }
  }, [filtros]);

  //   const getMenuItems = (rowData: any): MenuItem[] => [
  //     {
  //       label: "Ver",
  //       icon: <i className="fas fa-eye me-2"></i>,
  //       command: () => handleViewDocument(rowData.id),
  //     },
  //     {
  //       label: "Firmar",
  //       icon: <i className="fas fa-signature me-2"></i>,
  //       command: () => handleSignatureDocument(rowData),
  //       visible: !rowData.status_signature,
  //     },
  //     {
  //       label: "Enviar",
  //       icon: <i className="fas fa-paper-plane me-2"></i>,
  //       command: () =>
  //         generatePublicSignatureUrl(rowData, rowData.title || "Documento"),
  //       visible: !rowData.status_signature,
  //     },
  //     {
  //       label: "Eliminar",
  //       icon: <i className="fas fa-trash me-2"></i>,
  //       command: () => handleDeleteDocument(rowData.id),
  //     },
  //   ];

  //   const accionesBodyTemplate = (rowData: any) => {
  //     return (
  //       <div
  //         className="flex align-items-center justify-content-center"
  //         style={{ minWidth: "120px" }}
  //       >
  //         <CustomPRTableMenu
  //           rowData={rowData}
  //           menuItems={getMenuItems(rowData)}
  //         />
  //       </div>
  //     );
  //   };

  const estadosFactura = [
    { label: "Pagada", value: "paid" },
    { label: "Pendiente", value: "pending" },
    { label: "Parcialmente Pagada", value: "partially_pending" },
    { label: "Anulada", value: "cancelled" },
    { label: "Vencida", value: "expired" },
  ];
  const getEstadoSeverity = (estado: string) => {
    switch (estado) {
      case "paid":
        return "success";
      case "pending":
      case "partially_pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "expired":
        return "danger";
      default:
        return null;
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "paid":
        return "Pagada";
      case "pending":
        return "Pendiente";
      case "partially_pending":
        return "Parcialmente Pagada";
      case "cancelled":
        return "Anulada";
      case "expired":
        return "Vencida";
      default:
        return "";
    }
  };

  const columns = [
    {
      field: "id",
      header: "Id",
      sortable: true,
    },
    {
      field: "third_party.document_number",
      header: "RNC/Cedula o Pasaporte",
      sortable: true,
      body: (rowData: any) => {
        return rowData.third_party?.document_number || "";
      },
    },
    {
      field: "document_number",
      header: "Tipo de identificacion",
      sortable: true,
      body: (rowData: any) => {
        switch (rowData.third_party?.document_type) {
          case "RNC":
            return 1;
          case "CC":
            return 2;
          default:
            return 3;
        }
      },
    },
    {
      field: "invoice_code",
      header: "No. Comprobante fiscal",
      sortable: true,
      body: (rowData: any) => {
        return rowData.invoice_code || "";
      },
    },
    {
      field: "income_type",
      header: "Tipo de ingreso",
      sortable: true,
    },
    {
      field: "created_at",
      header: "Fecha de comprobante",
      sortable: true,
      body: (rowData: any) =>
        `${new Date(rowData.created_at).toLocaleDateString()}`.slice(0, 10),
    },
    {
      field: "retention_date",
      header: "Fecha de retencion",
      sortable: true,
    },
    {
      field: "amount",
      header: "Monto facturado",
      sortable: true,
      body: (rowData: any) => `$${Number(rowData.total_amount).toFixed(2)}`,
    },
    {
      field: "itbis_factured",
      header: "ITBIS facturado",
      sortable: true,
      body: (rowData: any) => `$${rowData.itbis_factured.toFixed(2)}`,
    },
    {
      field: "tax_isr_received",
      header: "ISR percibido",
      sortable: true,
      body: (rowData: any) => `$${rowData.tax_isr_received.toFixed(2)}`,
    },
    {
      field: "consumption_tax",
      header: "Impuesto selectivo al consumo",
      sortable: true,
      body: (rowData: any) => `$${rowData.consumption_tax.toFixed(2)}`,
    },
    {
      field: "iva",
      header: "Otro impuestos",
      sortable: true,
      body: (rowData: any) => `$${Number(rowData.iva).toFixed(2)}`,
    },
    {
      field: "payment_cash",
      header: "Efectivo",
      sortable: true,
        body: (rowData: any) => `$${rowData.payment_cash.toFixed(2)}`,
    },
    {
      field: "payment_transfer",
      header: "Cheque/transferencia/deposito",
      sortable: true,
      body: (rowData: any) => `$${rowData.payment_transfer.toFixed(2)}`,
    },
    {
      field: "payment_card",
      header: "Tarjeta débito/crédito",
      sortable: true,
      body: (rowData: any) => `$${rowData.payment_card.toFixed(2)}`,
    },
    {
      field: "payment_credit",
      header: "Venta a crédito",
      sortable: true,
      body: (rowData: any) => `$${rowData.payment_credit.toFixed(2)}`,
    },
    {
      field: "payment_gift_certificate",
      header: "Bonos o certificado de regalo",
      sortable: true,
      body: (rowData: any) => `$${rowData.payment_gift_certificate.toFixed(2)}`,
    },
    {
      field: "payment_swap",
      header: "Permuta",
      sortable: true,
      body: (rowData: any) => `$${rowData.payment_swap.toFixed(2)}`,
    },
    {
      field: "payment_default",
      header: "Otras formas de pago",
      sortable: true,
      body: (rowData: any) => `$${rowData.payment_default.toFixed(2)}`,
    },
    {
      field: "status",
      header: "Estado",
      sortable: true,
      body: (rowData: any) => (
        <Tag
          value={getEstadoLabel(rowData.status)}
          severity={getEstadoSeverity(rowData.status)}
        />
      ),
    },
    // {
    //   field: "actions",
    //   header: "Acciones",
    //   body: accionesBodyTemplate,
    //   exportable: false,
    //   style: { minWidth: "80px", textAlign: "center" },
    //   width: "80px",
    // },
  ];

  return (
    <PrimeReactProvider>
      <Card>
        <div className="d-flex justify-content-between">
          <h4>606 - Compras</h4>
        </div>
        <Accordion>
          <AccordionTab header="Filtros de Búsqueda">
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label">Número de factura</label>
                <InputText
                  value={filtros.numeroFactura}
                  onChange={(e) =>
                    handleFilterChange("numeroFactura", e.target.value)
                  }
                  placeholder="B01-001-0000001"
                  className="w-100"
                />
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label">Cliente</label>
                <Dropdown
                  value={filtros.cliente}
                  onChange={(e) =>
                    handleFilterChange("cliente", e.target.value)
                  }
                  options={thirdParties}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Seleccione un proveedor"
                  className="w-100"
                />
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label">Rango de fechas</label>
                <Calendar
                  value={filtros.fechaRango}
                  onChange={(e) => handleFilterChange("fechaRango", e.value)}
                  selectionMode="range"
                  readOnlyInput
                  dateFormat="dd/mm/yy"
                  placeholder="Seleccione un rango"
                  className="w-100"
                  showIcon
                />
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label">Estado</label>
                <Dropdown
                  value={filtros.estado}
                  options={estadosFactura}
                  onChange={(e) => handleFilterChange("estado", e.value)}
                  optionLabel="label"
                  placeholder="Seleccione estado"
                  className="w-100"
                />
              </div>

              <div className="col-12 d-flex justify-content-end gap-2">
                <Button
                  label="Limpiar"
                  icon="pi pi-trash"
                  className="p-button-secondary"
                  onClick={limpiarFiltros}
                />
                <Button
                  label="Aplicar Filtros"
                  icon="pi pi-filter"
                  className="p-button-primary"
                  onClick={() => refresh()}
                  loading={loadingPaginator}
                />
              </div>
            </div>
          </AccordionTab>
        </Accordion>
        <CustomPRTable
          columns={columns}
          data={consentsData}
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
      <Toast ref={toast} />
    </PrimeReactProvider>
  );
};
