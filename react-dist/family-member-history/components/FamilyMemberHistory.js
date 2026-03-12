import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { FamilyMemberHistoryTable } from "./FamilyMemberHistoryTable.js";
import { FamilyMemberHistoryFormModal } from "./FamilyMemberHistoryFormModal.js";
import { useFamilyMemberHistory } from "../hooks/useFamilyMemberHistory.js";
import { FamilyMemberHistoryHistoryModal } from "./FamilyMemberHistoryHistoryModal.js";
export const FamilyMemberHistory = props => {
  const {
    patientId
  } = props;
  const {
    records,
    isLoading,
    refetch,
    createRecord,
    updateRecord,
    updateStatus,
    deleteRecord
  } = useFamilyMemberHistory(patientId);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const handleCreate = () => {
    setSelectedRecord(null);
    setIsFormVisible(true);
  };
  const handleEdit = record => {
    setSelectedRecord(record);
    setIsFormVisible(true);
  };
  const handleSave = async data => {
    if (selectedRecord) {
      await updateRecord.mutateAsync({
        id: selectedRecord.id,
        data
      });
    } else {
      await createRecord.mutateAsync(data);
    }
    setIsFormVisible(false);
  };
  const handleDelete = async record => {
    await deleteRecord(record.id);
  };
  const handleStatusChange = async (id, status) => {
    await updateStatus.mutateAsync({
      id,
      status
    });
  };
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const handleHistory = record => {
    setSelectedRecord(record);
    setIsHistoryVisible(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card m-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-white d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "mb-0"
  }, "Antecedentes Familiares"), /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Antecedente",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus me-2"
    }),
    onClick: handleCreate
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(FamilyMemberHistoryTable, {
    data: records,
    loading: isLoading,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onHistory: handleHistory,
    onStatusChange: handleStatusChange,
    onReload: refetch
  })), /*#__PURE__*/React.createElement(FamilyMemberHistoryFormModal, {
    visible: isFormVisible,
    onHide: () => setIsFormVisible(false),
    onSave: handleSave,
    initialData: selectedRecord,
    saving: createRecord.isPending || updateRecord.isPending
  }), /*#__PURE__*/React.createElement(FamilyMemberHistoryHistoryModal, {
    visible: isHistoryVisible,
    onHide: () => setIsHistoryVisible(false),
    recordId: selectedRecord?.id || null,
    patientId: patientId
  }));
};