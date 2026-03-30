import React from "react";
import { DataTable } from "primereact/datatable";
import { TabView, TabPanel } from "primereact/tabview";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { useMedicationStatements } from "../hooks/useMedicationStatements.js";
import { MEDICATION_STATEMENT_STATUS, MEDICATION_STATEMENT_STATUS_OPTIONS } from "../consts/status.js";
import { MedicationHistoryModal } from "./MedicationHistoryModal.js";
import { MedicationStatementFormModal } from "./MedicationStatementFormModal.js";
export const ActiveMedicationsTable = ({
  patientId
}) => {
  const {
    medications,
    isLoading,
    updateMedicationStatus,
    createMedication,
    updateMedication,
    deleteMedication
  } = useMedicationStatements(patientId);
  const [historyVisible, setHistoryVisible] = React.useState(false);
  const [formVisible, setFormVisible] = React.useState(false);
  const [selectedMedication, setSelectedMedication] = React.useState(null);
  const [medicationToEdit, setMedicationToEdit] = React.useState(null);
  const menuRef = React.useRef(null);
  const [rowToManage, setRowToManage] = React.useState(null);
  const activeMedications = medications.filter(m => [MEDICATION_STATEMENT_STATUS.ACTIVE, MEDICATION_STATEMENT_STATUS.INTENDED, MEDICATION_STATEMENT_STATUS.ON_HOLD, MEDICATION_STATEMENT_STATUS.UNKNOWN].includes(m.status));
  const inactiveMedications = medications.filter(m => [MEDICATION_STATEMENT_STATUS.COMPLETED, MEDICATION_STATEMENT_STATUS.STOPPED, MEDICATION_STATEMENT_STATUS.NOT_TAKEN, MEDICATION_STATEMENT_STATUS.ENTERED_IN_ERROR].includes(m.status));
  const handleShowHistory = med => {
    setSelectedMedication({
      id: med.id,
      name: med.medicationName
    });
    setHistoryVisible(true);
  };
  const handleEdit = med => {
    setMedicationToEdit(med);
    setFormVisible(true);
  };
  const handleAdd = () => {
    setMedicationToEdit(null);
    setFormVisible(true);
  };
  const handleSave = data => {
    const payload = {
      ...data,
      notes: null
    };
    if (medicationToEdit) {
      updateMedication.mutate({
        id: medicationToEdit.id,
        data: payload
      }, {
        onSuccess: () => setFormVisible(false)
      });
    } else {
      createMedication.mutate(payload, {
        onSuccess: () => setFormVisible(false)
      });
    }
  };
  const showMenu = (event, rowData) => {
    setRowToManage(rowData);
    menuRef.current?.toggle(event);
  };
  const actionItems = [{
    label: 'Editar',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-edit me-2"
    }),
    command: () => rowToManage && handleEdit(rowToManage)
  }, {
    label: 'Ver Historial',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-history me-2"
    }),
    command: () => rowToManage && handleShowHistory(rowToManage)
  }, {
    separator: true
  }, {
    label: 'Eliminar',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-trash me-2"
    }),
    className: 'text-danger',
    command: () => rowToManage && deleteMedication(rowToManage.id)
  }];
  const statusTemplate = rowData => {
    return /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.status,
      options: MEDICATION_STATEMENT_STATUS_OPTIONS,
      onChange: e => updateMedicationStatus.mutate({
        id: rowData.id,
        status: e.value
      }),
      placeholder: "Seleccione",
      className: "w-100",
      style: {
        minWidth: '150px'
      }
    });
  };
  const actionTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end align-items-center"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-cog me-2"
      }),
      label: "Acciones",
      onClick: e => showMenu(e, rowData)
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card m-3"
  }, /*#__PURE__*/React.createElement(Menu, {
    model: actionItems,
    popup: true,
    ref: menuRef,
    appendTo: document.body
  }), /*#__PURE__*/React.createElement(MedicationHistoryModal, {
    visible: historyVisible,
    onHide: () => setHistoryVisible(false),
    medicationStatementId: selectedMedication?.id || null,
    medicationName: selectedMedication?.name || ""
  }), /*#__PURE__*/React.createElement(MedicationStatementFormModal, {
    visible: formVisible,
    onHide: () => setFormVisible(false),
    onSave: handleSave,
    initialData: medicationToEdit,
    saving: createMedication.isPending || updateMedication.isPending
  }), /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-white d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "mb-0"
  }, "Medicamentos del Paciente"), /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Medicamento",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-plus me-2"
    }),
    onClick: handleAdd
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body p-0"
  }, /*#__PURE__*/React.createElement(TabView, null, /*#__PURE__*/React.createElement(TabPanel, {
    header: `Activos (${activeMedications.length})`
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: activeMedications,
    loading: isLoading,
    emptyMessage: "No se encontraron medicamentos activos.",
    responsiveLayout: "stack",
    breakpoint: "960px",
    className: "p-datatable-sm"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "medicationName",
    header: "Medicamento",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "dosage",
    header: "Dosis"
  }), /*#__PURE__*/React.createElement(Column, {
    body: statusTemplate,
    header: "Estado",
    style: {
      width: '200px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionTemplate,
    header: "",
    style: {
      width: '120px'
    }
  }))), /*#__PURE__*/React.createElement(TabPanel, {
    header: `Inactivos (${inactiveMedications.length})`
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: inactiveMedications,
    loading: isLoading,
    emptyMessage: "No se encontraron medicamentos inactivos.",
    responsiveLayout: "stack",
    breakpoint: "960px",
    className: "p-datatable-sm"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "medicationName",
    header: "Medicamento",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "dosage",
    header: "Dosis"
  }), /*#__PURE__*/React.createElement(Column, {
    body: statusTemplate,
    header: "Estado",
    style: {
      width: '200px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionTemplate,
    header: "",
    style: {
      width: '120px'
    }
  }))))));
};