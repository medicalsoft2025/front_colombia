import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TaskDetails } from "./TaskDetails";
import { Ticket, Task } from "./utils/interfaces";
import { taskStatusMap, taskColorMap, formatDate } from "./utils/ticketUtils";

interface TicketDetailsProps {
  visible: boolean;
  ticket: Ticket | null;
  onHide: () => void;
}

export const TicketDetails: React.FC<TicketDetailsProps> = ({
  visible,
  ticket,
  onHide,
}) => {
  const [isTaskDetailsVisible, setIsTaskDetailsVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (!ticket) {
    return null;
  }

  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      open: "Abierto",
      new: "Abierto",
      closed: "Cerrado",
      in_progress: "En Proceso",
      pending: "Pendiente",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string): string => {
    const statusClassMap: Record<string, string> = {
      open: "bg-info",
      new: "bg-info",
      closed: "bg-secondary",
      in_progress: "bg-warning",
      pending: "bg-warning",
    };
    return statusClassMap[status] || "bg-info";
  };


  const truncateText = (text: string, maxLength: number = 40): string => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const actionBodyTemplate = (rowData: Task) => {
    return (
      <Button
        className="p-button-primary p-button-rounded"
        onClick={() => {
          setSelectedTask(rowData);
          setIsTaskDetailsVisible(true);
        }}
        tooltip="Ver detalles de la tarea"
        tooltipOptions={{ position: "top" }}
      >
        <i className="fas fa-eye"></i>
      </Button>
    );
  };

  const statusBodyTemplate = (rowData: Task) => {
    return (
      <span
        className={`badge ${taskColorMap[rowData.status_title]} p-2 text-white`}
        style={{
          fontSize: "0.875rem",
          borderRadius: "4px",
          textTransform: "none",
        }}
      >
        {taskStatusMap[rowData.status_title]}
      </span>
    );
  };

  const titleBodyTemplate = (rowData: Task) => {
    return (
      <span
        className="text-900 font-medium"
        title={rowData.title}
        style={{ cursor: "help" }}
      >
        {truncateText(rowData.title, 40)}
      </span>
    );
  };

  const assignedBodyTemplate = (rowData: Task) => {
    return (
      <div className="flex align-items-center">
        <i
          className="fas fa-user mx-2 text-primary"
          style={{ fontSize: "0.875rem" }}
        ></i>
        <span className="text-600"
          style={{ textTransform: "none" }}>
          {rowData.assigned_to_user || "Sin asignar"}
        </span>
      </div>
    );
  };

  const idBodyTemplate = (rowData: Task) => {
    return <span className="text-600 font-mono text-sm">#{rowData.id}</span>;
  };

  const renderTasksSection = () => {
    const tasks = ticket.tasks || [];

    return (
      <div className="mt-4">
        <div className="flex align-items-center justify-content-between mb-3">
          <label className="block text-600 font-bold">
            <i className="fas fa-tasks mx-2 text-primary"></i>
            Tareas del Ticket
          </label>
        </div>

        {tasks.length > 0 ? (
          <div className="card">
            <DataTable
              value={tasks}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25]}
              className="p-datatable-sm"
              showGridlines
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No hay tareas para mostrar"
              size="small"
              sortField="id"
              sortOrder={-1}
            >
              <Column
                field="id"
                header="ID"
                sortable
                style={{ width: "10%" }}
                body={idBodyTemplate}
              />
              <Column
                field="title"
                header="Título"
                sortable
                style={{ width: "35%" }}
                body={titleBodyTemplate}
              />
              <Column
                field="assigned_to_user"
                header="Asignado a"
                sortable
                style={{ width: "20%" }}
                body={assignedBodyTemplate}
              />
              <Column
                field="status_title"
                header="Estado"
                sortable
                style={{ width: "20%" }}
                body={statusBodyTemplate}
              />
              <Column
                header="Acciones"
                body={actionBodyTemplate}
                style={{ width: "15%", textAlign: "center" }}
              />
            </DataTable>
          </div>
        ) : (
          <div className="text-500 text-sm p-3 surface-100 border-round flex align-items-center">
            <p className="mb-0">Este ticket no tiene tareas asociadas.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog
        header="Detalles del Ticket"
        visible={visible}
        style={{ width: "85vw" }}
        onHide={onHide}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Cerrar"
              icon="fas fa-times"
              onClick={onHide}
              className="p-button-outlined"
            />
          </div>
        }
        draggable={false}
        resizable={false}
        className="ticket-details-dialog"
      >
        <div className="p-3">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <label className="block text-600 font-bold mb-1">
                <i className="fas fa-tag mx-2 text-primary"></i>
                Ticket #{ticket.id}
              </label>
              <div className="text-900 surface-100 border-round">
                <span className={`badge ${getStatusClass(ticket.status)} p-2`}>
                  {getStatusText(ticket.status)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-600 font-bold mb-1">
                <i className="fas fa-comment mx-2 text-primary"></i>
                Asunto
              </label>
              <div className="text-900 surface-100 border-round p-2">
                {ticket.title}
              </div>
            </div>

            <div>
              <label className="block text-600 font-bold mb-1">
                <i className="fas fa-user mx-2 text-primary"></i>
                Asignado a
              </label>
              <div className="text-900 surface-100 border-round p-2">
                {ticket.assigned_to_user || "Sin asignar"}
              </div>
            </div>

            <div>
              <label className="block text-600 font-bold mb-1">
                <i className="fas fa-calendar-alt mx-2 text-primary"></i>
                Fecha de Creación
              </label>
              <div className="text-900 surface-100 border-round p-2">
                {formatDate(ticket.created_at)}
              </div>
            </div>
          </div>

          <Divider />

          {renderTasksSection()}
        </div>
      </Dialog>

      <TaskDetails
        visible={isTaskDetailsVisible}
        task={selectedTask}
        onHide={() => {
          setIsTaskDetailsVisible(false);
          setSelectedTask(null);
        }}
      />
    </>
  );
};
