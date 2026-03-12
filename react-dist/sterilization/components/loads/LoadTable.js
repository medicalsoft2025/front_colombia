import React from 'react';
import { CustomPRTable } from "../../../components/CustomPRTable.js";
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
export const LoadTable = props => {
  const {
    loads,
    loading,
    onStatusChange,
    onViewPackages,
    onViewDetail,
    onViewHistory,
    totalRecords,
    first,
    perPage,
    handlePageChange,
    handleSearchChange,
    refetch
  } = props;
  const statusOptions = [{
    label: 'En Proceso',
    value: 'in_progress'
  }, {
    label: 'Esterilizada',
    value: 'sterilized'
  }, {
    label: 'Desechada',
    value: 'discarded'
  }];
  const columns = [{
    field: "sterilizationDate",
    header: "Fecha Esterilización",
    width: "12rem"
  }, {
    field: "packages",
    header: "Paquetes",
    width: "12rem",
    body: rowData => /*#__PURE__*/React.createElement(Button, {
      label: `${rowData.packages.length} Paquetes`,
      size: "small",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-box me-2"
      }),
      severity: "secondary",
      onClick: () => onViewPackages(rowData)
    })
  }, {
    field: "status",
    header: "Estado",
    width: "15rem",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.status,
      options: statusOptions,
      optionLabel: "label",
      optionValue: "value",
      onChange: e => onStatusChange(rowData.id, e.value),
      placeholder: "Seleccione un estado",
      className: "w-100"
    })
  }, {
    field: "actions",
    header: "Acciones",
    width: "10rem",
    body: rowData => /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 justify-content-center"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-eye"
      }),
      tooltip: "Ver detalle",
      className: "p-button-rounded p-button-text p-button-info",
      onClick: () => onViewDetail(rowData)
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-file-alt"
      }),
      tooltip: "Ver historial",
      className: "p-button-rounded p-button-text p-button-secondary",
      onClick: () => onViewHistory(rowData)
    }))
  }];

  // Assigning uuid like expected by CustomPRTable for missing id tracking if needed,
  // though CustomPRTable usually expects data objects.
  const tableData = loads.map(load => ({
    ...load,
    uuid: load.id.toString()
  }));
  return /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableData,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loading,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: refetch
  });
};