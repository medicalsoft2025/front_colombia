import React, { useState } from 'react';
import { LoadTable } from "./LoadTable.js";
import { LoadFormModal } from "./LoadFormModal.js";
import { LoadDetailModal } from "./LoadDetailModal.js";
import { LoadHistoryModal } from "./LoadHistoryModal.js";
import { LoadPackagesModal } from "./LoadPackagesModal.js";
import { useLoads } from "../../hooks/useLoads.js";
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
export const LoadsTab = () => {
  const [filters, setFilters] = useState({
    status: null,
    sterilizationDate: null
  });
  const {
    loads,
    isLoading,
    createLoad,
    updateLoadStatus,
    handlePageChange,
    handleSearchChange,
    totalRecords,
    first,
    perPage,
    refetch,
    toast
  } = useLoads(filters);
  const [formVisible, setFormVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [packagesVisible, setPackagesVisible] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const handleNew = () => {
    setFormVisible(true);
  };
  const handleSaveLoad = data => {
    createLoad.mutate(data, {
      onSuccess: () => setFormVisible(false)
    });
  };
  const handleStatusChange = (loadId, status) => {
    updateLoadStatus.mutate({
      id: loadId,
      status
    });
  };
  const handleViewDetail = load => {
    setSelectedLoad(load);
    setDetailVisible(true);
  };
  const handleViewHistory = load => {
    setSelectedLoad(load);
    setHistoryVisible(true);
  };
  const handleViewPackages = load => {
    setSelectedLoad(load);
    setPackagesVisible(true);
  };
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Accordion, {
    activeIndex: null,
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-4 mb-2 mb-md-0"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label d-block"
  }, "Estado"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filters.status,
    options: statusOptions,
    optionLabel: "label",
    optionValue: "value",
    onChange: e => setFilters(prev => ({
      ...prev,
      status: e.value
    })),
    placeholder: "Todos",
    className: "w-100",
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label d-block"
  }, "Fecha de esterilizaci\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
    value: filters.sterilizationDate,
    onChange: e => {
      if (e.value) {
        const d = e.value;
        setFilters(prev => ({
          ...prev,
          sterilizationDate: d
        }));
      } else {
        setFilters(prev => ({
          ...prev,
          sterilizationDate: null
        }));
      }
    },
    dateFormat: "yy-mm-dd",
    placeholder: "YYYY-MM-DD",
    className: "w-100"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "m-0"
  }, "Gesti\xF3n de Cargas"), /*#__PURE__*/React.createElement(Button, {
    label: "Nueva carga",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus me-2"
    }),
    className: "p-button-primary",
    onClick: handleNew
  })), /*#__PURE__*/React.createElement(LoadTable, {
    loads: loads,
    loading: isLoading,
    onStatusChange: handleStatusChange,
    onViewDetail: handleViewDetail,
    onViewHistory: handleViewHistory,
    onViewPackages: handleViewPackages,
    totalRecords: totalRecords,
    first: first,
    perPage: perPage,
    handlePageChange: handlePageChange,
    handleSearchChange: handleSearchChange,
    refetch: refetch
  }), /*#__PURE__*/React.createElement(LoadFormModal, {
    visible: formVisible,
    onHide: () => setFormVisible(false),
    onSave: handleSaveLoad,
    saving: createLoad.isPending
  }), /*#__PURE__*/React.createElement(LoadDetailModal, {
    visible: detailVisible,
    onHide: () => setDetailVisible(false),
    load: selectedLoad
  }), /*#__PURE__*/React.createElement(LoadHistoryModal, {
    visible: historyVisible,
    onHide: () => setHistoryVisible(false),
    loadId: selectedLoad?.id || null
  }), /*#__PURE__*/React.createElement(LoadPackagesModal, {
    visible: packagesVisible,
    onHide: () => setPackagesVisible(false),
    packages: selectedLoad?.packages || []
  }));
};