import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { SwalManager } from "../../../services/alertManagerImported.js";
import { useEntitieConfigCreate } from "./hooks/useEntitiesConfigCreate.js";
import { useEntitieConfigById } from "./hooks/useEntitiesConfigByid.js";
import { useEntitiesConfigDelete } from "./hooks/useEntitiesConfigDelete.js";
import { useEntitiesConfigUpdate } from "./hooks/useEntitiesConfigUpdate.js";
import { useEntitieConfigTable } from "./hooks/useEntitiesConfigTable.js";
import { EntitiesConfiTable } from "./table/EntitiesConfiTable.js";
import EntitiesConfigModal from "./modal/EntitiesConfigModal.js";
import { usePRToast } from "../../hooks/usePRToast.js";
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
export const EntitiesConfig = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const {
    entities,
    loading,
    error,
    refreshEntities
  } = useEntitieConfigTable();
  const {
    createEntities,
    loading: createLoading
  } = useEntitieConfigCreate();
  const {
    updateEntities,
    loading: updateLoading
  } = useEntitiesConfigUpdate();
  const {
    fetchEntitiesById,
    entitiesById,
    setEntitiesById
  } = useEntitieConfigById();
  const {
    deleteEntity,
    loading: deleteLoading
  } = useEntitiesConfigDelete();
  const {
    toast,
    showSuccessToast
  } = usePRToast();
  const onCreate = () => {
    setInitialData(undefined);
    setEntitiesById(null);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      const entitiesData = {
        name: data.name,
        entity_code: data.entity_code,
        document_type: data.document_type,
        document_number: data.document_number,
        email: data.email,
        address: data.address,
        phone: data.phone,
        city_id: data.city_id,
        country_id: data.country_id,
        department_id: data.department_id,
        tax_charge_id: data.tax_charge_id || 0,
        withholding_tax_id: data.withholding_tax_id || 0,
        koneksi_sponsor_slug: data.koneksi_sponsor_slug || null,
        type_organization_id: data.type_organization_id?.toString() || null,
        type_regime_id: data.type_regime_id?.toString() || null,
        type_liability_id: data.type_liability_id?.toString() || null,
        country_code: "CO",
        dv: data.dv,
        operation_type_id: data.operation_type_id?.toString() || null,
        coverage_type_id: data.coverage_type_id?.toString() || null,
        payment_method_id: data.payment_method_id?.toString() || null,
        document_type_id: data.document_type_id?.toString() || null,
        user_type_id: data.user_type_id?.toString() || null,
        contract_number: data.contract_number?.toString() || null,
        poliza_number: data.poliza_number?.toString() || null
      };
      if (entitiesById) {
        await updateEntities(entitiesById.id.toString(), entitiesData);
        SwalManager.success('Entidad actualizada correctamente');
        await refreshEntities();
        setShowFormModal(false);
      } else {
        await createEntities(entitiesData);
        SwalManager.success('Entidad creada correctamente');
        await refreshEntities();
        setShowFormModal(false);
      }
    } catch (error) {
      console.error("Error saving entity:", error);
    }
  };
  const handleTableEdit = async id => {
    try {
      await fetchEntitiesById(id);
      setShowFormModal(true);
    } catch (error) {
      console.error("Error fetching entity:", error);
    }
  };
  const handleDeleteEntities = async id => {
    try {
      const success = await deleteEntity(id);
      if (success) {
        showSuccessToast({
          message: "Entidad eliminada correctamente"
        });
        await refreshEntities();
      }
    } catch (error) {
      console.error("Error deleting entity:", error);
    }
  };
  useEffect(() => {
    if (entitiesById) {
      const data = {
        name: entitiesById.name,
        entity_code: entitiesById.entity_code,
        document_type: entitiesById.document_type,
        document_number: entitiesById.document_number,
        email: entitiesById.email,
        address: entitiesById.address,
        phone: entitiesById.phone,
        city_id: entitiesById.city_name || entitiesById.city_id,
        country_id: entitiesById.country_name || entitiesById.country_id,
        department_id: entitiesById.department_name || entitiesById.department_id,
        tax_charge_id: entitiesById.tax_charge_id || null,
        withholding_tax_id: entitiesById.withholding_tax_id || 0,
        koneksi_sponsor_slug: entitiesById.koneksi_sponsor_slug || null,
        type_organization_id: Number(entitiesById.type_organization_id) || null,
        type_regime_id: Number(entitiesById.type_regime_id) || null,
        type_liability_id: Number(entitiesById.type_liability_id) || null,
        dv: entitiesById.dv,
        operation_type_id: Number(entitiesById.operation_type_id) || null,
        coverage_type_id: Number(entitiesById.coverage_type_id) || null,
        payment_method_id: Number(entitiesById.payment_method_id) || null,
        document_type_id: Number(entitiesById.document_type_id) || null,
        user_type_id: Number(entitiesById.user_type_id) || null,
        contract_number: Number(entitiesById.contract_number) || null,
        poliza_number: Number(entitiesById.poliza_number) || null,
        isEditing: true
      };
      setInitialData(data);
    }
  }, [entitiesById]);
  return /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center mb-4 p-2"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onCreate,
    disabled: createLoading || updateLoading || deleteLoading,
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus me-2"
    }),
    label: createLoading || updateLoading ? 'Procesando...' : 'Nueva Entidad'
  })), error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger",
    role: "alert"
  }, error), /*#__PURE__*/React.createElement(EntitiesConfiTable, {
    onEditItem: handleTableEdit,
    entities: entities,
    onDeleteItem: handleDeleteEntities,
    loading: loading
  }), /*#__PURE__*/React.createElement(EntitiesConfigModal, {
    isVisible: showFormModal,
    onSave: handleSubmit,
    onClose: () => {
      setShowFormModal(false);
      setEntitiesById(null);
      setInitialData(undefined);
    },
    initialData: initialData,
    loading: createLoading || updateLoading || deleteLoading
  }));
};