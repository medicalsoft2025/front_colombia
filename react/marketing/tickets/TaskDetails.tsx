import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Task, Comment, CommentFormData } from "./utils/interfaces";
import { taskStatusMap, taskColorMap, formatDate } from "./utils/ticketUtils";
import { FilesComment } from "./FilesComment";
import { CommentForm } from "./CommentForm";

interface TaskDetailsProps {
  visible: boolean;
  task: Task | null;
  onHide: () => void;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({
  visible,
  task,
  onHide,
}) => {
  const [localTask, setLocalTask] = useState<Task | null>(null);
  const [loadingTask, setLoadingTask] = useState(false);
  const [isSavingComment, setIsSavingComment] = useState(false);
  const toast = useRef<Toast>(null);

  const clientPhone = "123456789000";

  const currentTask = localTask || task;

  const loadTask = async (taskId: string) => {
    try {
      setLoadingTask(true);
      const response = await fetch(
        `https://erp.medicalsoft.ai/si002/index.php/public_routes/search_task_by_id_dev/${taskId}`,
      );
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setLocalTask(data[0]);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo recargar la información de la tarea",
        life: 5000,
      });
    } finally {
      setLoadingTask(false);
    }
  };

  const handleSaveComment = async (data: CommentFormData) => {
    setIsSavingComment(true);
    try {
      const formData = new FormData();
      formData.append("project_id", "30");
      formData.append("commented_phone", clientPhone);
      formData.append("coment", data.message);
      formData.append("task_id", currentTask!.id);

      if (data.files && data.files.length > 0) {
        Array.from(data.files).forEach((file: File) => {
          formData.append(`file_names[]`, file.name);
          formData.append(`file_sizes[]`, file.size.toString());
          formData.append("file[]", file);
        });
      }

      const response = await fetch(
        "https://erp.medicalsoft.ai/si002/index.php/public_routes/create_comment_to_task",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el comentario");
      }

      toast.current?.show({
        severity: "success",
        summary: "¡Comentario enviado!",
        detail: "Tu comentario fue agregado correctamente.",
        life: 3000,
      });

      await loadTask(currentTask!.id);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error al enviar",
        detail:
          error instanceof Error
            ? error.message
            : "Ocurrió un problema al enviar el comentario",
        life: 5000,
      });
    } finally {
      setIsSavingComment(false);
    }
  };

  const renderComments = () => {
    if (!currentTask?.comments || currentTask.comments.length === 0) {
      return (
        <div className="text-500 text-sm p-3 surface-100 border-round">
          <p className="mb-0">Esta tarea no tiene comentarios.</p>
        </div>
      );
    }

    console.log("Tarea:", currentTask);

    return (
      <div className="d-flex flex-column gap-3">
        {currentTask.comments.map((comment, index) => (
          <div key={index} className="surface-100 border-round p-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              {/* <i className="fas fa-user-circle text-primary mx-2"></i> */}
              <span style={{ fontWeight: 700, fontSize: "1rem" }}>
                {comment.created_by_user}
              </span>
              <span
                style={{ fontWeight: 300, fontSize: "0.6rem", opacity: 0.5 }}
              >
                {formatDate(comment.created_at)}
              </span>
            </div>
            <p className="text-900 mb-0">{comment.description}</p>
            <FilesComment files={comment.files} />
            {index < currentTask.comments!.length - 1 && (
              <Divider className="my-2" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={
          currentTask
            ? `Detalles de la Tarea #${currentTask.id}`
            : "Detalles de la Tarea"
        }
        visible={visible}
        style={{ width: "85vw" }}
        onHide={onHide}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Cerrar"
              icon={<i className="fas fa-times"></i>}
              onClick={onHide}
              className="p-button-outlined"
            />
          </div>
        }
        draggable={false}
        resizable={false}
        className="task-details-dialog"
      >
        {currentTask ? (
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
                  {/* <i className="fas fa-tag mx-2 text-primary"></i> */}
                  Tarea #{currentTask.id}
                </label>
                <div className="text-900 surface-100 border-round">
                  <span
                    className={`badge ${taskColorMap[currentTask.status_title]} p-2 text-white`}
                  >
                    {taskStatusMap[currentTask.status_title]}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-600 font-bold mb-1">
                  {/* <i className="fas fa-ticket-alt mx-2 text-primary"></i> */}
                  Ticket Relacionado
                </label>
                <div className="text-900 surface-100 border-round p-2">
                  {currentTask.ticket_title}
                </div>
              </div>

              <div>
                <label className="block text-600 font-bold mb-1">
                  {/* <i className="fas fa-comment mx-2 text-primary"></i> */}
                  Título
                </label>
                <div className="text-900 surface-100 border-round p-2">
                  {currentTask.title}
                </div>
              </div>

              <div>
                <label className="block text-600 font-bold mb-1">
                  {/* <i className="fas fa-user mx-2 text-primary"></i> */}
                  Asignado a
                </label>
                <div className="text-900 surface-100 border-round p-2">
                  {currentTask.assigned_to_user || "Sin asignar"}
                </div>
              </div>
            </div>

            <Divider />

            <div className="mb-4">
              <label className="block text-600 font-bold mb-2">
                {/* <i className="fas fa-align-left mx-2 text-primary"></i> */}
                Descripción
              </label>
              <div
                className="surface-100 border-round p-3 text-900"
                dangerouslySetInnerHTML={{
                  __html: currentTask.description || "Sin descripción",
                }}
              />
            </div>

            <Divider />

            <div className="mt-2">
              <label className="block text-600 font-bold mb-2">
                {/* <i className="fas fa-comments mx-2 text-primary"></i> */}
                Comentarios
              </label>
              {loadingTask ? (
                <div className="text-500 text-sm p-3 surface-100 border-round flex align-items-center gap-2">
                  {/* <i className="fas fa-spinner fa-spin"></i> */}
                  <span>Actualizando comentarios...</span>
                </div>
              ) : (
                renderComments()
              )}

              <CommentForm
                taskId={currentTask.id}
                onSave={handleSaveComment}
                isSaving={isSavingComment}
              />
            </div>
          </div>
        ) : null}
      </Dialog>
    </>
  );
};
