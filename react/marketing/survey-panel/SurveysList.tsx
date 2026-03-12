import React, { useEffect, useState } from "react";
import {
  surveyService,
  inventoryService,
  specialtiesService,
  clinicalRecordTypeService,
} from "../../../services/api";
import { useDataPagination } from "../../hooks/useDataPagination";
import { PrimeReactProvider } from "primereact/api";
import { Card } from "primereact/card";
import { CustomPRTable } from "../../components/CustomPRTable";
import { CustomPRTableMenu } from "../../components/CustomPRTableMenu";
import { MenuItem } from "primereact/menuitem";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

export const SurveysList = () => {
  const [configureModal, setConfigureModal] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [services, setServices] = useState([]);
  const [clinicalRecordTypes, setClinicalRecordTypes] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      post_consultation_hours: null,
      attempts: null,
      service: null,
      specialty: null,
      clinical_record_type: null,
    },
  });

  const {
    data: surveyData,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataPagination({
    fetchFunction: (params) => loadSurveys(params),
    defaultPerPage: 10,
  });

  async function loadSurveys(params: any = { perPage: 10 }) {
    const backendFilters: any = {
      ...params,
    };

    if (params.search && params.search.trim() !== "") {
      backendFilters.search = params.search.trim();
    }

    const data = await surveyService.getAllFilter(backendFilters);

    return {
      data: data.data.data,
      total: data.data.total || 0,
    };
  }

  async function loadResources() {
    const specialties = await specialtiesService.getAll();
    const services = await inventoryService.getServices();
    const clinicalRecordTypes = await clinicalRecordTypeService.getAll();

    setSpecialties(specialties);
    setServices(services);
    setClinicalRecordTypes(clinicalRecordTypes);
  }

  const accionesBodyTemplate = (rowData: any) => {
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

  function handleConfigure(row: any) {
    setSelectedSurvey(row);
    setConfigureModal(true);
  }

  const handleSave = async (data: any) => {
    console.log(data);
    const payload = {
      survey_id: selectedSurvey?.id,
      post_consultation_hours: formattedDate(data.post_consultation_hours),
      attempts: data.attempts,
      specialty_id: data.specialty || null,
      clinical_record_type_id: data.clinical_record_type,
      service_id: data?.service?.toString() || null,
    };

    console.log(payload);
    await surveyService.saveConfigurationSurvey(payload);
    setConfigureModal(false);
  };

  function formattedDate(date: any) {
    const horas = addZero(date.getHours());
    const minutos = addZero(date.getMinutes());
    const segundos = addZero(date.getSeconds());
    return `${horas}:${minutos}:${segundos}`;
  }
  function addZero(number: any) {
    return number < 10 ? "0" + number : number;
  }

  const getMenuItems = (rowData: any): MenuItem[] => [
    // {
    //   label: "Editar",
    //   icon: <i className="fas fa-edit me-2"></i>,
    //   command: () => handleEditDocument(rowData.id),
    //   visible: !rowData.firmado,
    // },
    {
      label: "Ver",
      icon: <i className="fas fa-eye me-2"></i>,
    },
    {
      label: "Reenviar",
      icon: <i className="fas fa-paper-plane me-2"></i>,
    },
    {
      label: "Configurar",
      icon: <i className="fas fa-cog me-2"></i>,
      command: () => handleConfigure(rowData),
    },
    {
      label: "Eliminar",
      icon: <i className="fas fa-trash me-2"></i>,
    },
  ];

  const columns = [
    { field: "id", header: "ID" },
    { field: "title", header: "Titulo" },
    { field: "description", header: "Descripcion" },
    {
      field: "createdAt",
      header: "Fecha de creacion",
      body: (rowData: any) =>
        `${new Date(rowData.created_at).toLocaleDateString()}`.slice(0, 10),
    },
    {
      field: "actions",
      header: "Acciones",
      body: accionesBodyTemplate,
      exportable: false,
      style: { minWidth: "80px", textAlign: "center" },
      width: "80px",
    },
  ];

  useEffect(() => {
    loadResources();
  }, []);

  return (
    <PrimeReactProvider>
      <Card>
        <CustomPRTable
          columns={columns}
          data={surveyData}
          lazy
          first={first}
          rows={perPage}
          totalRecords={totalRecords}
          loading={loadingPaginator}
          onPage={handlePageChange}
          onSearch={handleSearchChange}
          onReload={() => refresh()}
        />
      </Card>
      <Dialog
        visible={configureModal}
        onHide={() => setConfigureModal(false)}
        header="Configuración de envío"
        style={{ width: "70vw" }}
      >
        <div className="container">
          <Card className="shadow-sm p-0">
            <form onSubmit={handleSubmit(handleSave)} className="p-fluid">
              <div className="row g-3">
                <div className="field col-6">
                  <label htmlFor="post_consultation_hours">
                    Despues de cuanto tiempo quiere que se envie
                  </label>
                  <Controller
                    name="post_consultation_hours"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Calendar
                        {...field}
                        className="w-100"
                        timeOnly
                        showIcon
                      />
                    )}
                  />
                </div>
                <div className="field col-6">
                  <label htmlFor="attempts">Reintentos</label>
                  <Controller
                    name="attempts"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <InputNumber
                        id={field.name}
                        value={field.value}
                        onValueChange={(e) => field.onChange(e.value)}
                        useGrouping={false}
                        className="w-100"
                      />
                    )}
                  />
                </div>
                <div className="field col-6">
                  <label htmlFor="clinical_record_type">
                    Vincular Tipo de historia clinica *
                  </label>
                  <Controller
                    name="clinical_record_type"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        options={clinicalRecordTypes}
                        optionLabel="name"
                        optionValue="id"
                        className="w-100"
                        filter
                      />
                    )}
                  />
                </div>
                <div className="field col-6">
                  <label htmlFor="specialty">Vincular especialidades</label>
                  <Controller
                    name="specialty"
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        options={specialties}
                        optionLabel="name"
                        optionValue="id"
                        className="w-100"
                        filter
                      />
                    )}
                  />
                </div>
                <div className="field col-6">
                  <label htmlFor="service">Vincular servicio prestado</label>
                  <Controller
                    name="service"
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        options={services}
                        optionLabel="name"
                        optionValue="id"
                        className="w-100"
                        filter
                      />
                    )}
                  />
                </div>
                <div className="col-12 d-flex justify-content-end mt-4">
                  <div className="d-flex align-items-end">
                    <Button
                      type="submit"
                      label="Guardar"
                      className="px-4" // Reduce el padding horizontal
                      style={{ minWidth: "100px" }} // Ancho mínimo personalizado
                    />
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </Dialog>
    </PrimeReactProvider>
  );
};
