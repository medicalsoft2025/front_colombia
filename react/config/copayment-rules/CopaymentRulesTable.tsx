import React, { useCallback, useEffect, useRef, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { copaymentRulesService } from "../../../services/api";
import { Toast } from "primereact/toast";
import { PrimeReactProvider } from "primereact/api";
import { CustomPRTable } from "../../components/CustomPRTable";
import { useDataPagination } from "../../hooks/useDataPagination";
import { CustomPRTableMenu } from "../../components/CustomPRTableMenu";
import { MenuItem } from "primereact/menuitem";
import { Button } from "primereact/button";

export const CopaymentRulesTable: React.FC<any> = ({
  refreshData = false,
  onHandleEdit = () => {},
}) => {
  const toast = useRef<Toast>(null);

  const {
    data: copaymentsRules,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataPagination({
    fetchFunction: (params) => loadCopaymentRules(params),
    defaultPerPage: 10,
  });

  useEffect(() => {
    if (refreshData) {
      refresh();
    }
  }, [refreshData]);

  async function loadCopaymentRules(params: any = { perPage: 10 }) {
    if (params.search === "") {
      delete params.search;
    }

    const data = await copaymentRulesService.getAllFilter(params);

    return {
      data: data.data,
      total: data.total || 0,
    };
  }

  async function handleEdit(id: any) {
    const data = await copaymentRulesService.get(id);
    onHandleEdit(data);
  }

  const onDelete = async (rowData: any) => {
    await copaymentRulesService.delete(rowData.id);
    refresh();
    toast.current?.show({
      severity: "warn",
      summary: "Éxito",
      detail: "Regla de copago eliminada correctamente",
      life: 3000,
    })
  };

  const accionesBodyTemplate = (rowData: any) => {
    return (
      <div className="d-flex gap-2">
        <Button
          icon={<i className="fa-solid fa-pen-to-square"></i>}
          className="p-button-text p-button-info"
          onClick={() => handleEdit(rowData.id)}
          tooltip="Editar"
        />
        <Button
          icon={<i className="fa-solid fa-trash"></i>}
          className="p-button-text p-button-danger"
          onClick={() => onDelete(rowData)}
          tooltip="Eliminar"
        />
      </div>
    );
  };

  const columns = [
    {
      field: "id",
      header: "Id",
      sortable: true,
    },
    {
      field: "regime_type",
      header: "Tipo de régimen",
      sortable: true,
      body: (rowData: any) => {
        return rowData.regime_type === "contributory"
          ? "Contributivo"
          : "Subsidiado";
      },
    },
    {
      field: "attention_type",
      header: "Tipo de atención",
      sortable: true,
      body: (rowData: any) => {
        return rowData.attention_type === "consultation"
          ? "Consulta"
          : "Procedimiento";
      },
    },
    {
      field: "affiliate_type",
      header: "Tipo de afilición",
      sortable: true,
      body: (rowData: any) => {
        return rowData.affiliate_type === "1" ? "Cotizante" : "Beneficiario";
      },
    },
    {
      field: "category",
      header: "Categoría",
      sortable: true,
      body: (rowData: any) => `${rowData.category}`,
    },
    {
      field: "value",
      header: "Valor",
      sortable: true,
      body: (rowData: any) => {
        return rowData.value_type === "fixed"
          ? "$" + rowData.value
          : rowData.value + "%";
      },
    },
    {
      field: "level",
      header: "Nivel",
      sortable: true,
      body: (rowData: any) => {
        return rowData.level;
      },
    },
    {
      field: "actions",
      header: "Acciones",
      body: accionesBodyTemplate,
      exportable: false,
      style: { minWidth: "80px", textAlign: "center" },
      width: "80px",
    },
  ];

  return (
    <PrimeReactProvider>
      <Card>
        <CustomPRTable
          columns={columns}
          data={copaymentsRules}
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
