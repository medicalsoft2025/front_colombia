import React, { useState } from 'react';
import { PackageTable } from "./PackageTable.js";
import { PackageFormModal } from "./PackageFormModal.js";
import { usePackages } from "../../hooks/usePackages.js";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
export const PackagesTab = () => {
  const {
    packages,
    isLoading,
    refetch,
    createPackage,
    updatePackage,
    deletePackage,
    toast
  } = usePackages();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const handleNew = () => {
    setSelectedPackage(null);
    setModalVisible(true);
  };
  const handleEdit = pkg => {
    setSelectedPackage(pkg);
    setModalVisible(true);
  };
  const handleDelete = pkg => {
    deletePackage(pkg.id);
  };
  const handleSave = data => {
    if (selectedPackage) {
      updatePackage.mutate({
        id: selectedPackage.id,
        data
      }, {
        onSuccess: () => setModalVisible(false)
      });
    } else {
      createPackage.mutate(data, {
        onSuccess: () => setModalVisible(false)
      });
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "m-0"
  }, "Gesti\xF3n de Paquetes"), /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo paquete",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus me-2"
    }),
    className: "p-button-primary",
    onClick: handleNew
  })), /*#__PURE__*/React.createElement(PackageTable, {
    data: packages,
    loading: isLoading,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onReload: refetch
  }), /*#__PURE__*/React.createElement(PackageFormModal, {
    visible: modalVisible,
    onHide: () => setModalVisible(false),
    onSave: handleSave,
    initialData: selectedPackage,
    saving: createPackage.isPending || updatePackage.isPending
  }));
};