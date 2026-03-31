export const getTenant = (): string => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  return parts.length >= 2 ? parts[0] : "";
};

export const ticketStatusMap: Record<string, string> = {
  open: "Abierto",
  new: "Abierto",
  closed: "Cerrado",
  in_progress: "En Proceso",
  pending: "Pendiente",
};

export const ticketColorMap: Record<string, string> = {
  open: "bg-info",
  new: "bg-info",
  closed: "bg-secondary",
  in_progress: "bg-warning",
  pending: "bg-warning",
};

export const taskStatusMap: Record<string, string> = {
  "To Do": "Por Hacer",
  "In progress": "En Progreso",
  Done: "Terminada",
};

export const taskColorMap: Record<string, string> = {
  "To Do": "bg-info",
  "In progress": "bg-warning",
  Done: "bg-success",
};

export const formatDate = (dateString: string): string => {
  if (!dateString || dateString === "0000-00-00 00:00:00")
    return "No disponible";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

// Retorna true si el archivo es una imagen por su extension
export const isImageFile = (fileName: string): boolean => {
  const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"];
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  return imageExtensions.includes(extension);
};

// Retorna la clase de icono de Font Awesome segun la extension del archivo
export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  const iconMap: Record<string, string> = {
    pdf: "fas fa-file-pdf text-danger",
    doc: "fas fa-file-word text-primary",
    docx: "fas fa-file-word text-primary",
    xls: "fas fa-file-excel text-success",
    xlsx: "fas fa-file-excel text-success",
    ppt: "fas fa-file-powerpoint text-warning",
    pptx: "fas fa-file-powerpoint text-warning",
    zip: "fas fa-file-archive text-secondary",
    rar: "fas fa-file-archive text-secondary",
    txt: "fas fa-file-alt text-secondary",
    csv: "fas fa-file-csv text-success",
    mp4: "fas fa-file-video text-info",
    mp3: "fas fa-file-audio text-info",
  };

  return iconMap[extension] || "fas fa-file text-secondary";
};

// Formatea el tamanio del archivo a una cadena legible
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};