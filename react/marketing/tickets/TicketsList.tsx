import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ticketStatusMap, ticketColorMap } from "./utils/ticketUtils";
import { Ticket } from "./utils/interfaces";

interface TicketsListProps {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  onNewTicket: () => void;
  onViewTicket: (ticket: Ticket) => void;
}

export const TicketsList: React.FC<TicketsListProps> = ({
  tickets,
  loading,
  error,
  onNewTicket,
  onViewTicket,
}) => {
  const statusBodyTemplate = (rowData: Ticket) => {
    const statusText = ticketStatusMap[rowData.status] || rowData.status;
    const colorClass = ticketColorMap[rowData.status] || "bg-light text-dark";
    return <span className={`badge ${colorClass}`}>{statusText}</span>;
  };

  const actionBodyTemplate = (rowData: Ticket) => {
    return (
      <Button
        className="p-button-primary p-button-rounded flex align-items-center justify-content-center"
        aria-label="Ver"
        onClick={() => onViewTicket(rowData)}
        tooltip="Ver detalles del ticket"
        tooltipOptions={{ position: "top" }}
      >
        <i className="fas fa-search"></i>
      </Button>
    );
  };

  if (error) {
    return (
      <div className="card p-3 text-center">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3>Listado de Tickets</h3>
          <Button
            className="p-button-info d-flex gap-2 "
            aria-label="Crear Ticket"
            onClick={onNewTicket}
          >
            <i className="fas fa-plus"></i> Crear Ticket
          </Button>
        </div>
        <div className="text-info mb-3">
          <i className="fas fa-exclamation-circle fa-2x"></i>
          <p className="mt-2">No hay tickets para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-3">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3>Listado de Tickets</h3>
        <Button
          className="p-button-info d-flex gap-2 "
          aria-label="Crear Ticket"
          onClick={onNewTicket}
        >
          <i className="fas fa-plus"></i> Crear Ticket
        </Button>
      </div>

      <DataTable
        value={tickets}
        paginator
        rows={10}
        emptyMessage="No hay tickets encontrados."
        loading={loading}
      >
        <Column
          field="id"
          header="ID"
          sortable
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="title"
          header="Asunto"
          sortable
          style={{ width: "30%", textTransform: "uppercase" }}
        ></Column>
        <Column
          field="assigned_to_user"
          header="Asignado a"
          sortable
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="created_at"
          header="Fecha Creación"
          sortable
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="status"
          header="Estado"
          body={statusBodyTemplate}
          sortable
          style={{ width: "10%" }}
        ></Column>
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ width: "10%", textAlign: "center" }}
          header="Acciones"
        ></Column>
      </DataTable>
    </div>
  );
};
