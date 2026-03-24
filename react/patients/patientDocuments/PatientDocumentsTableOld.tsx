import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import {
  patientDocumentsService,
  tenantConfigService,
  patientService,
} from "../../../services/api";
import { Toast } from "primereact/toast";
import { PrimeReactProvider } from "primereact/api";
import { CustomPRTable } from "../../components/CustomPRTable";
import { useDataPagination } from "../../hooks/useDataPagination";
import { Image } from "primereact/image";
import { MenuItem } from "primereact/menuitem";
import { CustomPRTableMenu } from "../../components/CustomPRTableMenu";

export const PatientDocumentsTableOld: React.FC<any> = ({
  refreshData = false,
  onHandleEdit = () => {},
}) => {
  const toast = useRef<Toast>(null);
  const patientId = new URLSearchParams(window.location.search).get(
    "patient_id",
  );

  const {
    data: patientDocuments,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataPagination({
    fetchFunction: (params) => loadPatientDocuments(params),
    defaultPerPage: 10,
  });

  useEffect(() => {
    if (refreshData) {
      refresh();
    }
  }, [refreshData]);

  async function loadPatientDocuments(params: any = { perPage: 10 }) {
    const tenantConfig = await tenantConfigService.getConfig();
    const patient = await patientService.get(patientId);
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const url = new URL(
      `https://erp.medicalsoft.ai/ba001/migracion.php?action=files&client_id=ba001&patient_id=1}`,
    );
    const clinicalRecords = await fetch(url.toString(), {
      method: "GET",
      headers,
    });
    const response = await clinicalRecords.json();
    console.log("response", response);

    return {
      data: response.archivos,
      total: 0,
    };
  }

  async function handleEditDocument(id: number) {
    const documentData = await patientDocumentsService.get(id);
    onHandleEdit(documentData);
  }

  async function handleDeleteDocument(id: number) {
    const responseDelete = await patientDocumentsService.delete(id);
    refresh();
    toast.current?.show({
      severity: "warn",
      summary: "Éxito",
      detail: "Documento del paciente eliminado correctamente",
      life: 3000,
    });
  }

  const getMenuItems = (rowData: any): MenuItem[] => [
    {
      label: "Editar",
      icon: <i className="fas fa-edit me-2"></i>,
      command: () => handleEditDocument(rowData.id),
    },
    {
      label: "Eliminar",
      icon: <i className="fas fa-trash me-2"></i>,
      command: () => handleDeleteDocument(rowData.id),
    },
  ];

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

  const columns = [
    {
      field: "id",
      header: "Id",
      sortable: true,
    },
    {
      field: "codigo",
      header: "Nombre del documento",
      sortable: true,
      body: (rowData: any) => {
        return rowData.codigo;
      },
    },
    {
      field: "Image",
      header: "Documento",
      sortable: true,
      body: (rowData: any) => {
        const typeFile = rowData.codigo.slice(-3);
        switch (typeFile) {
          case "pdf":
            return (
              <div className="d-flex flex justify-content-center">
                <a
                  className="text-center"
                  href={rowData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-solid fa-file-pdf fa-2x text-danger"></i>
                  <h3>Ver PDF</h3>
                </a>
              </div>
            );
          case "PNG":
          case "jpg":
            return (
              <div className="d-flex flex justify-content-center">
                <Image
                  src={rowData.url}
                  zoomSrc={rowData.url}
                  alt="Image"
                  width="80"
                  height="60"
                  preview
                />
              </div>
            );
        }
      },
    },
    // {
    //   field: "actions",
    //   header: "Acciones",
    //   body: accionesBodyTemplate,
    //   exportable: false,
    //   style: { minWidth: "80px", textAlign: "center" },
    //   width: "80px",
    // },
  ];

  return (
    <PrimeReactProvider>
      <Card>
        <CustomPRTable
          columns={columns}
          data={patientDocuments}
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
      <Toast ref={toast} />
    </PrimeReactProvider>
  );
};
