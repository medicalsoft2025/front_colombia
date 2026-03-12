import React, { useRef, useState } from 'react';
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Dropdown } from 'primereact/dropdown';
import { relationshipCodeMap, familyMemberHistoryStatuses } from "../consts/index.js";
export const FamilyMemberHistoryTable = props => {
  const {
    data,
    loading,
    onEdit,
    onDelete,
    onHistory,
    onStatusChange,
    onReload
  } = props;
  const menuRef = useRef(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const showMenu = (event, rowData) => {
    setSelectedRow(rowData);
    menuRef.current?.toggle(event);
  };
  const items = [{
    label: 'Editar',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-edit me-1"
    }),
    command: () => selectedRow && onEdit(selectedRow)
  }, {
    label: 'Ver Historial',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-history me-1"
    }),
    command: () => selectedRow && onHistory(selectedRow)
  }, {
    separator: true
  }, {
    label: 'Eliminar',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-trash me-1"
    }),
    className: 'text-danger',
    command: () => selectedRow && onDelete(selectedRow)
  }];
  const columns = [{
    field: 'relationshipCode',
    header: 'Familiar',
    body: rowData => {
      return relationshipCodeMap[rowData.relationshipCode] || rowData.relationshipCode;
    }
  }, {
    field: 'cie11',
    header: 'CIE11',
    body: rowData => /*#__PURE__*/React.createElement("div", {
      style: {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        maxWidth: '300px'
      }
    }, rowData.cie11)
  }, {
    field: 'status',
    header: 'Estado',
    body: rowData => {
      return /*#__PURE__*/React.createElement(Dropdown, {
        value: rowData.status,
        options: familyMemberHistoryStatuses,
        onChange: e => onStatusChange(rowData.id, e.value),
        optionLabel: "label",
        optionValue: "value",
        className: "w-100"
      });
    }
  }, {
    field: 'actions',
    header: 'Acciones',
    body: rowData => {
      return /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-end align-items-center gap-2"
      }, /*#__PURE__*/React.createElement(Button, {
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa fa-cog me-1"
        }),
        label: "Acciones",
        severity: "secondary",
        onClick: e => showMenu(e, rowData)
      }));
    }
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Menu, {
    model: items,
    popup: true,
    ref: menuRef
  }), /*#__PURE__*/React.createElement(CustomPRTable, {
    data: data,
    columns: columns,
    loading: loading,
    onReload: onReload
  }));
};