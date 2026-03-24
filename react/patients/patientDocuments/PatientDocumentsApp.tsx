import React from "react";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { PatientDocumentsForm } from "./PatientDocumentsForm";
import { PatientDocumentsTable } from "./PatientDocumentsTable";
import { PatientDocumentsTableOld } from "./PatientDocumentsTableOld";
import { Dialog } from "primereact/dialog";
import { patientDocumentsService } from "../../../services/api";
import { TabView, TabPanel } from "primereact/tabview";

export const PatientDocumentsApp: React.FC<any> = () => {
  const toast = React.useRef<Toast>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [refreshTable, setRefreshTable] = React.useState(false);
  const [dataToEdit, setDataToEdit] = React.useState<any>(null);

  const handleFormToggle = () => {
    setShowForm((prev) => !prev);
    setRefreshTable(false);
  };

  const handleOnEdit = (data: any) => {
    setDataToEdit(data);
    setShowForm((prev) => !prev);
  };

  const handleOnSave = async (data: any) => {
    try {
      if (data.id) {
        const response = await patientDocumentsService.update(data.id, data);
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Documento del paciente actualizado correctamente",
          life: 3000,
        });
      } else {
        const response = await patientDocumentsService.create(data);
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Documento del paciente creado correctamente",
          life: 3000,
        });
      }

      setShowForm((prev) => !prev);
      setRefreshTable(true);
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    }
  };

  return (
    <>
      <Card>
        <TabView>
          <TabPanel header="Medical actual">
            <div className="d-flex justify-content-between">
              <h4>Documentos</h4>
              <div className="d-flex gap-2">
                <Button
                  label="Nuevo"
                  tooltipOptions={{ position: "top" }}
                  onClick={() => handleFormToggle()}
                  className="p-button-info "
                >
                  <i className="fa-solid fa-plus ms-2"> </i>
                </Button>
              </div>
            </div>
            <PatientDocumentsTable
              refreshData={refreshTable}
              onHandleEdit={handleOnEdit}
            />
          </TabPanel>
          <TabPanel header="Medical anterior">
            <PatientDocumentsTableOld
              refreshData={refreshTable}
              onHandleEdit={handleOnEdit}
            />
          </TabPanel>
        </TabView>
      </Card>
      <Dialog
        visible={showForm}
        onHide={handleFormToggle}
        header="Nuevo Documento"
        style={{ width: "70vw" }}
      >
        <PatientDocumentsForm
          onSave={handleOnSave}
          dataToEdit={dataToEdit}
        ></PatientDocumentsForm>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
};
