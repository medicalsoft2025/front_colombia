import React, { useState, useEffect } from "react";
import { TicketsList } from "./TicketsList";
import { TicketForm } from "./TicketForm";
import { TicketDetails } from "./TicketDetails";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { getTenant } from "./utils/ticketUtils";
import { Ticket, TicketFormData } from "./utils/interfaces";

export const TicketsApp = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const codSistema = "dev";
  const clientPhone = "123456789000";
  const usuario = "UsuarioActual";

  const handleNewTicket = () => {
    setIsFormVisible(true);
  };

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const tenant = getTenant();
      const response = await fetch(
        `https://erp.medicalsoft.ai/si002/index.php/public_routes/search_ticket_by_cod_tenant/${tenant}`,
      );
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSaveTicket = async (data: TicketFormData) => {
    setIsSaving(true);

    try {
      const formData = new FormData();

      const frequencyMap: { [key: string]: string } = {
        always: "siempre",
        sometimes: "ocasional",
        rarely: "rara vez",
        once: "unica vez",
      };

      const valorFrecuencia = frequencyMap[data.frequency] || "";

      formData.append("ticket_phone_client", clientPhone);
      formData.append("ticket_project_id", "30");
      formData.append("ticket_requested_phone", clientPhone);
      formData.append("ticket_title", `${codSistema} - ${data.subject}`);

      formData.append("ticket_descripcion", data.message);
      formData.append("ticket_pasos", data.stepsToReproduce);
      formData.append("ticket_resultadosEsperados", data.expectedResults);
      formData.append("ticket_frecuencia", valorFrecuencia);

      data.tags.forEach((etiqueta) => {
        formData.append(`ticket_labels[]`, etiqueta);
      });

      formData.append("task_title", `${codSistema} - ${data.subject}`);
      const descripcionTask = `${data.message}<br><br><b>Pasos para reproducir el error: </b>${data.stepsToReproduce}<br><br><b>Resultados Esperados: </b>${data.expectedResults}<br><br><b>Frecuencia: </b>${valorFrecuencia}`;
      formData.append("task_description", descripcionTask);

      if (data.files && data.files.length > 0) {
        Array.from(data.files).forEach((file: File) => {
          formData.append(`file_names[]`, file.name);
          formData.append(`file_sizes[]`, file.size.toString());
          formData.append("file[]", file);
        });
      }

      formData.append("client_codigoSistema", codSistema);
      formData.append("client_usuario", usuario);

      const response = await fetch(
        "https://erp.medicalsoft.ai/si002/index.php/public_routes/create_ticket_and_task_test",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el ticket");
      }

      const result = await response.json();

      toast.current?.show({
        severity: "success",
        summary: "¡Ticket enviado!",
        detail:
          "Tu solicitud fue enviada correctamente, será procesada en breve.",
        life: 3000,
      });

      setIsFormVisible(false);

      await loadTickets();
    } catch (error) {
      console.error("Error al enviar ticket:", error);

      toast.current?.show({
        severity: "error",
        summary: "Error al enviar",
        detail:
          error instanceof Error
            ? error.message
            : "Ocurrió un problema al enviar el ticket",
        life: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsVisible(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsVisible(false);
    setSelectedTicket(null);
  };

  return (
    <>
      <Toast ref={toast} />
      <Card className="m-3">
        <TicketsList
          tickets={tickets}
          loading={loading}
          error={error}
          onNewTicket={handleNewTicket}
          onViewTicket={handleViewTicket}
        />

        <TicketForm
          visible={isFormVisible}
          onHide={() => setIsFormVisible(false)}
          onSave={handleSaveTicket}
          isSaving={isSaving}
        />

        <TicketDetails
          visible={isDetailsVisible}
          ticket={selectedTicket}
          onHide={handleCloseDetails}
        />
      </Card>
    </>
  );
};
