import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { Message } from "primereact/message";
import { resourcesAdminService } from "../../../../services/api";

type Severity =
  | "success"
  | "info"
  | "warning"
  | "secondary"
  | "danger"
  | "contrast";

export type TerceroFormData = {
  type: string;
  organization_type: any;
  municipality_id: any;
  liability_type: any;
  regime_type: any;
  contact: {
    name: string;
    document_type: string;
    document_number: string;
    dv: string;
    email: string;
    phone: string;
    address: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    second_last_name: string;
    date_of_birth: string | null; // Cambiado a string para coincidir con Contact
  };
};

interface ThirdPartyModalProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (formData: TerceroFormData) => void;
  onEdit?: (formData: TerceroFormData) => void;
  initialData?: TerceroFormData | null;
  loading?: boolean;
  error?: string | null;
}

export const ThirdPartyModal: React.FC<ThirdPartyModalProps> = ({
  visible,
  onHide,
  onSubmit,
  onEdit,
  initialData,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<TerceroFormData>({
    type: "client",
    organization_type: "",
    municipality_id: "",
    liability_type: "",
    regime_type: "",
    contact: {
      name: "",
      document_type: "CC",
      document_number: "",
      dv: "",
      email: "",
      phone: "",
      address: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      second_last_name: "",
      date_of_birth: null,
    },
  });

  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [organizationTypes, setOrganizationTypes] = useState<any[]>([]);
  const [municipalities, setMunicipalities] = useState<any[]>([]);
  const [liabilityTypes, setLiabilityTypes] = useState<any[]>([]);
  const [regimeTypes, setRegimeTypes] = useState<any[]>([]);

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (visible && initialData) {
      setFormData({
        type: initialData.type,
        organization_type: Number(initialData.organization_type) || "", // Handle potential missing data for old records
        municipality_id: Number(initialData.municipality_id) || "",
        liability_type: Number(initialData.liability_type) || "",
        regime_type: Number(initialData.regime_type) || "",
        contact: {
          name: initialData.contact.name,
          document_type: initialData.contact.document_type,
          document_number: initialData.contact.document_number,
          dv: initialData.contact.dv,
          email: initialData.contact.email,
          phone: initialData.contact.phone,
          address: initialData.contact.address,
          first_name: initialData.contact.first_name,
          middle_name: initialData.contact.middle_name || "",
          last_name: initialData.contact.last_name,
          second_last_name: initialData.contact.second_last_name || "",
          date_of_birth: initialData.contact.date_of_birth,
        },
      });

      // Convertir string a Date para el calendario
      if (initialData.contact.date_of_birth) {
        setDateOfBirth(new Date(initialData.contact.date_of_birth));
      } else {
        setDateOfBirth(null);
      }
    } else if (visible) {
      // Resetear formulario cuando se abre para crear nuevo
      setFormData({
        type: "client",
        organization_type: "",
        municipality_id: "",
        liability_type: "",
        regime_type: "",
        contact: {
          name: "",
          document_type: "CC",
          document_number: "",
          dv: "",
          email: "",
          phone: "",
          address: "",
          first_name: "",
          middle_name: "",
          last_name: "",
          second_last_name: "",
          date_of_birth: null,
        },
      });
      setDateOfBirth(null);
    }
  }, [visible, initialData]);

  useEffect(() => {
    loadResources();
  }, []);

  async function loadResources() {
    const organizationTypes =
      await resourcesAdminService.getOrganizationTypes();
    const municipalities = await resourcesAdminService.getMunicipalities();
    const liabilityTypes = await resourcesAdminService.getLiabilityTypes();
    const regimeTypes = await resourcesAdminService.getRegimeTypes();

    setOrganizationTypes(organizationTypes);
    setMunicipalities(municipalities);
    setLiabilityTypes(liabilityTypes);
    setRegimeTypes(regimeTypes);
  }

  const tipoTerceroOptions = [
    { label: "Cliente", value: "client" },
    { label: "Proveedor", value: "provider" },
    { label: "Entidad", value: "entity" },
  ];

  const tipoDocumentoOptions = [
    { label: "Cédula", value: "CC" },
    { label: "NIT", value: "NIT" },
    { label: "Pasaporte", value: "PA" },
    { label: "Extranjería", value: "CE" },
    { label: "RNC", value: "RNC" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("contact.")) {
      const contactField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDropdownChange = (e: { value: string }, field: string) => {
    if (field.startsWith("contact.")) {
      const contactField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: e.value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: e.value,
      }));
    }
  };

  const handleDateChange = (e: { value: Date | Date[] | null }) => {
    if (e.value && !Array.isArray(e.value)) {
      const selectedDate = e.value as Date;
      setDateOfBirth(selectedDate);

      // Formatear fecha a string ISO (YYYY-MM-DD)
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setFormData((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          date_of_birth: formattedDate,
        },
      }));
    } else {
      setDateOfBirth(null);
      setFormData((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          date_of_birth: null,
        },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!formData.contact.document_number) {
      return;
    }

    if (initialData && onEdit) {
      onEdit(formData);
    } else {
      onSubmit(formData);
    }
  };

  const getFormattedTitle = () => {
    return initialData
      ? `Editar Tercero - ${initialData.contact.first_name}`
      : "Nuevo Tercero";
  };

  return (
    <Dialog
      header={getFormattedTitle()}
      visible={visible}
      style={{ width: "70vw" }}
      onHide={onHide}
      maximizable
      modal
      className="p-fluid"
    >
      <form onSubmit={handleSubmit}>
        {error && <Message severity="error" text={error} className="mb-4" />}

        <div className="row mb-4">
          {/* Columna izquierda - Información básica */}
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="type" className="form-label">
                Tipo de Tercero *
              </label>
              <Dropdown
                id="type"
                value={formData.type}
                options={tipoTerceroOptions}
                onChange={(e) => handleDropdownChange(e, "type")}
                placeholder="Seleccione tipo"
                className="w-100"
                disabled={!!initialData}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="contact.document_type" className="form-label">
                Tipo de Documento *
              </label>
              <Dropdown
                id="contact.document_type"
                value={formData.contact.document_type}
                options={tipoDocumentoOptions}
                onChange={(e) =>
                  handleDropdownChange(e, "contact.document_type")
                }
                placeholder="Seleccione tipo"
                className="w-100"
                disabled={!!initialData}
              />
            </div>

            <div className="row">
              <div
                className={
                  formData.contact.document_type === "NIT"
                    ? "col-8 mb-3"
                    : "col-12 mb-3"
                }
              >
                <label htmlFor="contact.document_number" className="form-label">
                  Número de Documento *
                </label>
                <InputText
                  id="contact.document_number"
                  name="contact.document_number"
                  value={formData.contact.document_number}
                  onChange={handleInputChange}
                  className="w-100"
                  placeholder="Ingrese el número de documento"
                  disabled={!!initialData}
                  required
                />
              </div>
              {formData.contact.document_type === "NIT" && (
                <div
                  className={
                    formData.contact.document_type === "NIT"
                      ? "col-4 mb-3"
                      : "d-none"
                  }
                >
                  <label htmlFor="contact.dv" className="form-label">
                    DV *
                  </label>
                  <InputText
                    id="contact.dv"
                    name="contact.dv"
                    value={formData.contact.dv}
                    onChange={handleInputChange}
                    className="w-100"
                    placeholder="Ingrese el DV"
                    disabled={!!initialData}
                    required
                  />
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="contact.email" className="form-label">
                Correo Electrónico
              </label>
              <InputText
                id="contact.email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleInputChange}
                className="w-100"
                placeholder="ejemplo@dominio.com"
                type="email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="contact.phone" className="form-label">
                Teléfono
              </label>
              <InputMask
                id="contact.phone"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleInputChange}
                className="w-100"
                placeholder="Ingrese número telefónico"
                mask="999-999-9999"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="contact.address" className="form-label">
                Dirección
              </label>
              <InputText
                id="contact.address"
                name="contact.address"
                value={formData.contact.address}
                onChange={handleInputChange}
                className="w-100"
                placeholder="Ingrese dirección completa"
              />
            </div>
          </div>

          {/* Columna derecha - Información personal */}
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="contact.name" className="form-label">
                Razón social *
              </label>
              <InputText
                id="contact.name"
                name="contact.name"
                value={formData.contact.name}
                onChange={handleInputChange}
                className="w-100"
                placeholder="Ingrese la razón social"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="contact.first_name" className="form-label">
                Primer Nombre
              </label>
              <InputText
                id="contact.first_name"
                name="contact.first_name"
                value={formData.contact.first_name}
                onChange={handleInputChange}
                className="w-100"
                placeholder="Ingrese primer nombre"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="contact.middle_name" className="form-label">
                Segundo Nombre
              </label>
              <InputText
                id="contact.middle_name"
                name="contact.middle_name"
                value={formData.contact.middle_name}
                onChange={handleInputChange}
                className="w-100"
                placeholder="Ingrese segundo nombre (si aplica)"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="contact.last_name" className="form-label">
                Primer Apellido
              </label>
              <InputText
                id="contact.last_name"
                name="contact.last_name"
                value={formData.contact.last_name}
                onChange={handleInputChange}
                className="w-100"
                placeholder="Ingrese primer apellido"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="contact.second_last_name" className="form-label">
                Segundo Apellido
              </label>
              <InputText
                id="contact.second_last_name"
                name="contact.second_last_name"
                value={formData.contact.second_last_name}
                onChange={handleInputChange}
                className="w-100"
                placeholder="Ingrese segundo apellido (si aplica)"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="date_of_birth" className="form-label">
                Fecha de Nacimiento
              </label>
              <Calendar
                id="date_of_birth"
                value={dateOfBirth}
                onChange={handleDateChange}
                dateFormat="dd/mm/yy"
                className="w-100"
                showIcon
                placeholder="Seleccione fecha"
                maxDate={new Date()}
                yearRange="1900:2030"
              />
            </div>
          </div>
        </div>

        <hr className="my-4" />
        <h5 className="mb-3">Información Facturación Electrónica</h5>
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="organization_type" className="form-label">
                Tipo de Organización
              </label>
              <Dropdown
                id="organization_type"
                value={formData.organization_type}
                options={organizationTypes}
                onChange={(e) => handleDropdownChange(e, "organization_type")}
                placeholder="Seleccione tipo"
                className="w-100"
                optionLabel="name"
                optionValue="id"
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="liability_type" className="form-label">
                Agente retenedor
              </label>
              <Dropdown
                id="liability_type"
                value={formData.liability_type}
                options={liabilityTypes}
                onChange={(e) => handleDropdownChange(e, "liability_type")}
                placeholder="Seleccione tipo"
                className="w-100"
                optionLabel="name"
                optionValue="id"
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="regime_type" className="form-label">
                Tipo de Régimen
              </label>
              <Dropdown
                id="regime_type"
                value={formData.regime_type}
                options={regimeTypes}
                onChange={(e) => handleDropdownChange(e, "regime_type")}
                placeholder="Seleccione tipo"
                className="w-100"
                optionLabel="name"
                optionValue="id"
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="municipality_id" className="form-label">
                Municipio/Ciudad
              </label>
              <Dropdown
                id="municipality_id"
                value={formData.municipality_id}
                options={municipalities}
                onChange={(e) => handleDropdownChange(e, "municipality_id")}
                placeholder="Seleccione tipo"
                className="w-100"
                virtualScrollerOptions={{ itemSize: 38 }}
                filter
                optionLabel="name"
                optionValue="id"
                required
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <Button
            label="Cancelar"
            className="p-button-secondary me-3"
            style={{ minWidth: "80px" }}
            onClick={onHide}
            disabled={loading}
          >
            {" "}
            <i className="fas fa-times me-2"></i>
          </Button>
          <Button
            label={initialData ? "Actualizar" : "Guardar"}
            className="p-button-primary"
            type="submit"
            style={{ minWidth: "80px" }}
            loading={loading}
          >
            {" "}
            <i className="fas fa-check me-2"></i>
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
