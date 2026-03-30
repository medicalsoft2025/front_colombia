import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { MenuItem } from "primereact/menuitem";
import { useThirdParties } from "../hooks/useThirdParties";
import { TerceroFormData, ThirdPartyModal } from "../modals/ThridPartiesModal";
import { useThirdPartyCreate } from "../hooks/useThirdPartyCreate";
import { useThirdPartyUpdate } from "../hooks/useThirdPartyUpdate";
import { useThirdPartyDelete } from "../hooks/useThirdPartyDelete";
import {
  CustomPRTable,
  CustomPRTableColumnProps,
} from "../../../components/CustomPRTable";
import { CustomPRTableMenu } from "../../../components/CustomPRTableMenu";
import { SwalManager } from "../../../../services/alertManagerImported";

type Severity =
  | "primary"
  | "success"
  | "info"
  | "warning"
  | "secondary"
  | "danger"
  | "contrast";

export type Tercero = {
  id: number;
  name: string;
  type: string;
  document_type: string;
  document_number: string;
  email: string;
  phone: string;
  address: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  second_last_name?: string;
  date_of_birth: string | null;
  type_organization_id: string;
  municipality_id: string;
  type_liability_id: string;
  type_regime_id: string;
  dv: string;
  account_number: any;
  subtype: any;
  bank_id: any;
  bank_name: any;
};

type FiltrosBusqueda = {
  tipoTercero: string | null;
  documento: string | null;
  nombre: string | null;
  fechaDesde: Date | null;
  fechaHasta: Date | null;
};

export const ThridPartiesTable: React.FC = () => {
  const { thirdParties, fetchThirdParties, loading } = useThirdParties();
  const { createThirdParty } = useThirdPartyCreate();
  const { updateThirdParty } = useThirdPartyUpdate();
  const { deleteThirdParty } = useThirdPartyDelete();
  const [error, setError] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTercero, setSelectedTercero] = useState<Tercero | null>(null);
  const [initialData, setInitialData] = useState<TerceroFormData | null>(null);

  const [filtros, setFiltros] = useState<FiltrosBusqueda>({
    tipoTercero: null,
    documento: null,
    nombre: null,
    fechaDesde: null,
    fechaHasta: null,
  });

  const tiposTercero = [
    { label: "Cliente", value: "client" },
    { label: "Proveedor", value: "provider" },
    { label: "Entidad", value: "entity" },
  ];

  const handleSaveTercero = async (formData: TerceroFormData) => {
    try {
      if (selectedTercero) {
        await updateThirdParty(selectedTercero.id.toString(), {
          name: formData.contact.name,
          type: formData.type,
          document_type: formData.contact.document_type,
          document_number: formData.contact.document_number,
          email: formData.contact.email,
          phone: formData.contact.phone,
          address: formData.contact.address,
          first_name: formData.contact.first_name,
          middle_name: formData.contact.middle_name,
          last_name: formData.contact.last_name,
          second_last_name: formData.contact.second_last_name,
          date_of_birth: formData.contact.date_of_birth,
          type_organization_id: formData.organization_type.toString(),
          municipality_id: formData.municipality_id.toString(),
          type_liability_id: formData.liability_type.toString(),
          type_regime_id: formData.regime_type.toString(),
          dv: formData.contact.dv.toString(),
          account_number: formData.medicalPay?.account_number,
          subtype: formData.medicalPay?.subtype,
          bank_id: formData.medicalPay?.bank_id,
          bank_name: formData.medicalPay?.bank_name,
        });
      } else {
        await createThirdParty({
          name: formData.contact.name,
          type: formData.type,
          document_type: formData.contact.document_type,
          document_number: formData.contact.document_number,
          email: formData.contact.email,
          phone: formData.contact.phone,
          address: formData.contact.address,
          first_name: formData.contact.first_name,
          middle_name: formData.contact.middle_name,
          last_name: formData.contact.last_name,
          second_last_name: formData.contact.second_last_name,
          date_of_birth: formData.contact.date_of_birth,
          type_organization_id: formData.organization_type.toString(),
          municipality_id: formData.municipality_id.toString(),
          type_liability_id: formData.liability_type.toString(),
          type_regime_id: formData.regime_type.toString(),
          dv: formData.contact.dv.toString(),
          account_number: formData.medicalPay?.account_number,
          subtype: formData.medicalPay?.subtype,
          bank_id: formData.medicalPay?.bank_id,
          bank_name: formData.medicalPay?.bank_name,
        });
      }
      fetchThirdParties();
      setModalVisible(false);
      setSelectedTercero(null);
      setInitialData(null);
    } catch (error) {
      console.error(error);
      SwalManager.error({
        title: "Error",
        text: "No se pudo guardar el tercero",
      });
    }
  };

  const handleEditTercero = (tercero: Tercero) => {
    setInitialData({
      type: tercero?.type || "",
      organization_type: tercero?.type_organization_id || "",
      municipality_id: tercero?.municipality_id || "",
      liability_type: tercero?.type_liability_id || "",
      regime_type: tercero?.type_regime_id || "",
      contact: {
        name: tercero?.name || "",
        document_type: tercero?.document_type || "",
        document_number: tercero?.document_number || "",
        email: tercero?.email || "",
        phone: tercero?.phone || "",
        address: tercero?.address || "",
        first_name: tercero?.first_name || "",
        middle_name: tercero?.middle_name || "",
        last_name: tercero?.last_name || "",
        second_last_name: tercero?.second_last_name || "",
        date_of_birth: tercero?.date_of_birth || "",
        dv: tercero?.dv || "",
      },
      medicalPay: {
        account_number: tercero?.account_number || "",
        subtype: tercero?.subtype || "",
        bank_id: tercero?.bank_id || "",
        bank_name: tercero?.bank_name || "",
        bank: tercero?.bank_id || null,
      },
    });
    setSelectedTercero(tercero);
    setModalVisible(true);
  };

  const handleDeleteTercero = async (tercero: Tercero) => {
    SwalManager.confirmDelete(async () => {
      const confirmed = await deleteThirdParty(tercero.id.toString());
      if (confirmed) {
        fetchThirdParties();
        SwalManager.success({ title: "Tercero eliminado correctamente" });
      }
    });
  };

  const handleFilterChange = (field: keyof FiltrosBusqueda, value: any) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const aplicarFiltros = async () => {
    try {
      setError(null);
      // Aquí puedes implementar la lógica de filtrado si es necesario
    } catch (err) {
      setError("Ocurrió un error al aplicar los filtros");
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      tipoTercero: null,
      documento: null,
      nombre: null,
      fechaDesde: null,
      fechaHasta: null,
    });
    setError(null);
  };

  const handleSearchChange = (searchValue: string) => {
    handleFilterChange("nombre", searchValue);
  };

  const handleRefresh = () => {
    limpiarFiltros();
    fetchThirdParties();
  };

  const getMenuItems = (rowData: Tercero): MenuItem[] => [
    {
      label: "Editar",
      icon: <i className="fas fa-pencil-alt me-2"></i>,
      command: () => handleEditTercero(rowData),
    },
    {
      label: "Eliminar",
      icon: <i className="fa-solid fa-trash me-2"></i>,
      command: () => handleDeleteTercero(rowData),
    },
  ];

  const actionBodyTemplate = (rowData: Tercero) => {
    return (
      <div
        className="flex align-items-center justify-content-center"
        style={{ minWidth: "120px" }}
      >
        <CustomPRTableMenu
          rowData={rowData}
          menuItems={getMenuItems(rowData)}
        />
      </div>
    );
  };

  const tipoTerceroTemplate = (rowData: Tercero) => {
    const tipoMap: Record<string, { severity: Severity; label: string }> = {
      client: { severity: "success", label: "Cliente" },
      provider: { severity: "info", label: "Proveedor" },
      entity: { severity: "primary", label: "Entidad" },
    };

    const { severity = "secondary", label = rowData.type } =
      tipoMap[rowData.type] || {};
    return <Tag value={label} severity={severity} />;
  };

  const documentoTemplate = (rowData: Tercero) => {
    return `${rowData.document_type || ""} ${rowData.document_number}`.trim();
  };

  const tableItems =
    thirdParties?.map((tercero: any) => ({
      id: tercero.id,
      type: tercero.type,
      document_type: tercero.document_type,
      document_number: tercero.document_number,
      name: tercero.name,
      email: tercero.email,
      phone: tercero.phone,
      address: tercero.address,
      actions: tercero,
    })) || [];

  const columns: CustomPRTableColumnProps[] = [
    {
      field: "id",
      header: "ID",
      sortable: true,
    },
    {
      field: "type",
      header: "Tipo",
      sortable: true,
      body: (rowData: any) => tipoTerceroTemplate(rowData.actions),
    },
    {
      field: "document_number",
      header: "Documento",
      sortable: true,
      body: (rowData: any) => documentoTemplate(rowData.actions),
    },
    {
      field: "name",
      header: "Nombre Completo",
      sortable: true,
    },
    {
      field: "email",
      header: "Email",
      sortable: true,
    },
    {
      field: "phone",
      header: "Teléfono",
      sortable: true,
    },
    {
      field: "address",
      header: "Dirección",
      sortable: true,
    },
    {
      field: "actions",
      header: "Acciones",
      body: (rowData: any) => actionBodyTemplate(rowData.actions),
      exportable: false,
    },
  ];

  const styles = {
    card: {
      marginBottom: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: "0.5rem",
      display: "block",
    },
  };

  return (
    <div
      className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
      style={{ minHeight: "400px" }}
    >
      <div className="card-body h-100 w-100 d-flex flex-column">
        <ThirdPartyModal
          visible={modalVisible}
          onHide={() => {
            setModalVisible(false);
            setSelectedTercero(null);
            setInitialData(null);
          }}
          onSubmit={handleSaveTercero}
          onEdit={handleSaveTercero}
          initialData={initialData}
          loading={false}
          error={null}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "10px",
          }}
        >
          <Button
            label="Crear Nuevo Tercero"
            icon="pi pi-file-edit"
            className="p-button-primary"
            onClick={() => {
              setInitialData(null);
              setSelectedTercero(null);
              setModalVisible(true);
            }}
          />
        </div>

        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <CustomPRTable
            columns={columns}
            data={tableItems}
            loading={loading}
            onSearch={handleSearchChange}
            onReload={fetchThirdParties}
            searchPlaceholder="Buscar terceros por nombre..."
          />
        )}
      </div>
    </div>
  );
};
