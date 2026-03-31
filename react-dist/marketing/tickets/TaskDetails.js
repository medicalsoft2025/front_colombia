import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { taskStatusMap, taskColorMap, formatDate } from "./utils/ticketUtils.js";
import { FilesComment } from "./FilesComment.js";
import { CommentForm } from "./CommentForm.js";
export const TaskDetails = ({
  visible,
  task,
  onHide
}) => {
  const [localTask, setLocalTask] = useState(null);
  const [loadingTask, setLoadingTask] = useState(false);
  const [isSavingComment, setIsSavingComment] = useState(false);
  const toast = useRef(null);
  const clientPhone = "123456789000";
  const currentTask = localTask || task;
  const loadTask = async taskId => {
    try {
      setLoadingTask(true);
      const response = await fetch(`https://erp.medicalsoft.ai/si002/index.php/public_routes/search_task_by_id_dev/${taskId}`);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setLocalTask(data[0]);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo recargar la información de la tarea",
        life: 5000
      });
    } finally {
      setLoadingTask(false);
    }
  };
  const handleSaveComment = async data => {
    setIsSavingComment(true);
    try {
      const formData = new FormData();
      formData.append("project_id", "30");
      formData.append("commented_phone", clientPhone);
      formData.append("coment", data.message);
      formData.append("task_id", currentTask.id);
      if (data.files && data.files.length > 0) {
        Array.from(data.files).forEach(file => {
          formData.append(`file_names[]`, file.name);
          formData.append(`file_sizes[]`, file.size.toString());
          formData.append("file[]", file);
        });
      }
      const response = await fetch("https://erp.medicalsoft.ai/si002/index.php/public_routes/create_comment_to_task", {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el comentario");
      }
      toast.current?.show({
        severity: "success",
        summary: "¡Comentario enviado!",
        detail: "Tu comentario fue agregado correctamente.",
        life: 3000
      });
      await loadTask(currentTask.id);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error al enviar",
        detail: error instanceof Error ? error.message : "Ocurrió un problema al enviar el comentario",
        life: 5000
      });
    } finally {
      setIsSavingComment(false);
    }
  };
  const renderComments = () => {
    if (!currentTask?.comments || currentTask.comments.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        className: "text-500 text-sm p-3 surface-100 border-round"
      }, /*#__PURE__*/React.createElement("p", {
        className: "mb-0"
      }, "Esta tarea no tiene comentarios."));
    }
    console.log("Tarea:", currentTask);
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-column gap-3"
    }, currentTask.comments.map((comment, index) => /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "surface-100 border-round p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2 mb-2"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        fontSize: "1rem"
      }
    }, comment.created_by_user), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 300,
        fontSize: "0.6rem",
        opacity: 0.5
      }
    }, formatDate(comment.created_at))), /*#__PURE__*/React.createElement("p", {
      className: "text-900 mb-0"
    }, comment.description), /*#__PURE__*/React.createElement(FilesComment, {
      files: comment.files
    }), index < currentTask.comments.length - 1 && /*#__PURE__*/React.createElement(Divider, {
      className: "my-2"
    }))));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    header: currentTask ? `Detalles de la Tarea #${currentTask.id}` : "Detalles de la Tarea",
    visible: visible,
    style: {
      width: "85vw"
    },
    onHide: onHide,
    footer: /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-end gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Cerrar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-times"
      }),
      onClick: onHide,
      className: "p-button-outlined"
    })),
    draggable: false,
    resizable: false,
    className: "task-details-dialog"
  }, currentTask ? /*#__PURE__*/React.createElement("div", {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem",
      marginBottom: "1.5rem"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-600 font-bold mb-1"
  }, "Tarea #", currentTask.id), /*#__PURE__*/React.createElement("div", {
    className: "text-900 surface-100 border-round"
  }, /*#__PURE__*/React.createElement("span", {
    className: `badge ${taskColorMap[currentTask.status_title]} p-2 text-white`
  }, taskStatusMap[currentTask.status_title]))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-600 font-bold mb-1"
  }, "Ticket Relacionado"), /*#__PURE__*/React.createElement("div", {
    className: "text-900 surface-100 border-round p-2"
  }, currentTask.ticket_title)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-600 font-bold mb-1"
  }, "T\xEDtulo"), /*#__PURE__*/React.createElement("div", {
    className: "text-900 surface-100 border-round p-2"
  }, currentTask.title)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-600 font-bold mb-1"
  }, "Asignado a"), /*#__PURE__*/React.createElement("div", {
    className: "text-900 surface-100 border-round p-2"
  }, currentTask.assigned_to_user || "Sin asignar"))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-600 font-bold mb-2"
  }, "Descripci\xF3n"), /*#__PURE__*/React.createElement("div", {
    className: "surface-100 border-round p-3 text-900",
    dangerouslySetInnerHTML: {
      __html: currentTask.description || "Sin descripción"
    }
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "mt-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-600 font-bold mb-2"
  }, "Comentarios"), loadingTask ? /*#__PURE__*/React.createElement("div", {
    className: "text-500 text-sm p-3 surface-100 border-round flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "Actualizando comentarios...")) : renderComments(), /*#__PURE__*/React.createElement(CommentForm, {
    taskId: currentTask.id,
    onSave: handleSaveComment,
    isSaving: isSavingComment
  }))) : null));
};