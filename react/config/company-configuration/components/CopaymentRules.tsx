import React from "react";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { CopaymentRulesForm } from "../../copayment-rules/CopaymentRulesForm";
import { CopaymentRulesTable } from "../../copayment-rules/CopaymentRulesTable";
import { Dialog } from "primereact/dialog";
import { copaymentRulesService } from "../../../../services/api";

export const CopaymentRules: React.FC<any> = ({ companyId = null }) => {
  const toast = React.useRef<Toast>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [refreshTable, setRefreshTable] = React.useState(false);

  const handleFormToggle = () => {
    setShowForm((prev) => !prev);
    setRefreshTable(false);
  };

  const handleOnSave = async (data: any) => {

    try {
      const response = await copaymentRulesService.create(data);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Regla de copago creada correctamente",
        life: 3000,
      });
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
        <div className="d-flex justify-content-between">
          <h4>Copagos</h4>
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
        <CopaymentRulesTable refreshData={refreshTable} />
      </Card>
      <Dialog
        visible={showForm}
        onHide={handleFormToggle}
        header="Nueva regla de copago"
        style={{ width: "70vw" }}
      >
        <CopaymentRulesForm
          companyId={companyId}
          onSave={handleOnSave}
        ></CopaymentRulesForm>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
};
