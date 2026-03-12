import React, { useRef, useState } from 'react';
import { CustomPRTable } from "../../../components/CustomPRTable.js";
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
export const PackageTable = props => {
  const {
    data,
    loading,
    onEdit,
    onDelete,
    onReload,
    readOnly = false
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
    command: () => selectedRow && onEdit && onEdit(selectedRow)
  }, {
    separator: true
  }, {
    label: 'Eliminar',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-trash me-1"
    }),
    className: 'text-danger',
    command: () => selectedRow && onDelete && onDelete(selectedRow)
  }];
  const columns = [{
    field: 'name',
    header: 'Nombre'
  }, {
    field: 'prefix',
    header: 'Prefijo'
  }, {
    field: 'content',
    header: 'Contenido'
  }];
  if (!readOnly) {
    columns.push({
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
          onClick: e => showMenu(e, rowData)
        }));
      }
    });
  }
  return /*#__PURE__*/React.createElement("div", null, !readOnly && /*#__PURE__*/React.createElement(Menu, {
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