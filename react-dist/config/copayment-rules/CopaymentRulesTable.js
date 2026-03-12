import React, { useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { copaymentRulesService } from "../../../services/api/index.js";
import { Toast } from "primereact/toast";
import { PrimeReactProvider } from "primereact/api";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { useDataPagination } from "../../hooks/useDataPagination.js";
export const CopaymentRulesTable = ({
  refreshData = false
}) => {
  const toast = useRef(null);
  const {
    data: copaymentsRules,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh
  } = useDataPagination({
    fetchFunction: params => loadCopaymentRules(params),
    defaultPerPage: 10
  });
  useEffect(() => {
    console.log("refreshData", refreshData);
    if (refreshData) {
      refresh();
    }
  }, [refreshData]);
  async function loadCopaymentRules(params = {
    perPage: 10
  }) {
    if (params.search === "") {
      delete params.search;
    }
    const data = await copaymentRulesService.getAllFilter(params);
    return {
      data: data.data,
      total: data.total || 0
    };
  }
  const columns = [{
    field: "id",
    header: "Id",
    sortable: true
  }, {
    field: "regime_type",
    header: "Tipo de régimen",
    sortable: true,
    body: rowData => {
      return rowData.regime_type === "contributory" ? "Contributivo" : "Subsidiado";
    }
  }, {
    field: "attention_type",
    header: "Tipo de atención",
    sortable: true,
    body: rowData => {
      return rowData.attention_type === "consultation" ? "Consulta" : "Procedimiento";
    }
  }, {
    field: "affiliate_type",
    header: "Tipo de afilición",
    sortable: true,
    body: rowData => {
      return rowData.affiliate_type === "1" ? "Cotizante" : "Beneficiario";
    }
  }, {
    field: "category",
    header: "Categoría",
    sortable: true,
    body: rowData => `${rowData.category}`
  }, {
    field: "value",
    header: "Valor",
    sortable: true,
    body: rowData => {
      return rowData.value_type === "fixed" ? "$" + rowData.value : rowData.value + "%";
    }
  }, {
    field: "level",
    header: "Nivel",
    sortable: true,
    body: rowData => {
      return rowData.level;
    }
  }
  // {
  //   field: "actions",
  //   header: "Acciones",
  //   body: accionesBodyTemplate,
  //   exportable: false,
  //   style: { minWidth: "80px", textAlign: "center" },
  //   width: "80px",
  // },
  ];
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: copaymentsRules,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loadingPaginator,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: () => refresh()
  })), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }));
};