import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { AllergiesTable } from "./AllergiesTable.js";
import { AllergyFormModal } from "./AllergyFormModal.js";
import { useAllergies } from "../hooks/useAllergies.js";
import { AllergyHistoryModal } from "./AllergyHistoryModal.js";
export const Allergies = props => {
  const {
    patientId
  } = props;
  const {
    allergies,
    isLoading,
    refetch,
    createAllergy,
    updateAllergy,
    updateAllergyStatus,
    deleteAllergy
  } = useAllergies(patientId);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedAllergy, setSelectedAllergy] = useState(null);
  const handleCreate = () => {
    setSelectedAllergy(null);
    setIsFormVisible(true);
  };
  const handleEdit = allergy => {
    setSelectedAllergy(allergy);
    setIsFormVisible(true);
  };
  const handleSave = async data => {
    if (selectedAllergy) {
      await updateAllergy.mutateAsync({
        id: selectedAllergy.id,
        data
      });
    } else {
      await createAllergy.mutateAsync(data);
    }
    setIsFormVisible(false);
  };
  const handleDelete = async allergy => {
    await deleteAllergy(allergy.id);
  };
  const handleStatusChange = async (id, status) => {
    await updateAllergyStatus.mutateAsync({
      id,
      status
    });
  };
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const handleHistory = allergy => {
    setSelectedAllergy(allergy);
    setIsHistoryVisible(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card m-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-white d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "mb-0"
  }, "Alergias del Paciente"), /*#__PURE__*/React.createElement(Button, {
    label: "Nueva Alergia",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus me-2"
    }),
    onClick: handleCreate
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(AllergiesTable, {
    data: allergies,
    loading: isLoading,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onHistory: handleHistory,
    onStatusChange: handleStatusChange,
    onReload: refetch
  })), /*#__PURE__*/React.createElement(AllergyFormModal, {
    visible: isFormVisible,
    onHide: () => setIsFormVisible(false),
    onSave: handleSave,
    initialData: selectedAllergy,
    saving: createAllergy.isPending || updateAllergy.isPending
  }), /*#__PURE__*/React.createElement(AllergyHistoryModal, {
    visible: isHistoryVisible,
    onHide: () => setIsHistoryVisible(false),
    allergyId: selectedAllergy?.id || null,
    patientId: patientId
  }));
};