import React, { useState } from "react";
import { Galleria } from "primereact/galleria";
import { FileComment } from "./utils/interfaces";
import { isImageFile, getFileIcon, formatFileSize } from "./utils/ticketUtils";

interface CommentFilesProps {
  files: FileComment[] | null;
}

export const CommentFiles: React.FC<CommentFilesProps> = ({ files }) => {
  const [galleriaVisible, setGalleriaVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!files || files.length === 0) return null;

  // Filtramos solo las imagenes para pasarselas a la Galleria
  const imageFiles = files.filter((f) => isImageFile(f.file_name));

  const handleImageClick = (file: FileComment) => {
    const index = imageFiles.findIndex((f) => f.file_name === file.file_name);
    setActiveIndex(index);
    setGalleriaVisible(true);
  };

  const handleFileClick = (file: FileComment) => {
    window.open(file.file_url, "_blank");
  };

  // Template de la imagen principal en la Galleria
  const itemTemplate = (file: FileComment) => {
    return (
      <img
        src={file.file_url}
        alt={file.file_name}
        style={{
          maxWidth: "100%",
          maxHeight: "80vh",
          objectFit: "contain",
          display: "block",
          margin: "0 auto",
        }}
      />
    );
  };

  // Template de las miniaturas en la barra inferior de la Galleria
  const thumbnailTemplate = (file: FileComment) => {
    return (
      <img
        src={file.file_url}
        alt={file.file_name}
        style={{
          width: "60px",
          height: "45px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />
    );
  };

  // Template del caption con nombre y tamaño del archivo
  const captionTemplate = (file: FileComment) => {
    return (
      <div className="text-center">
        <p className="mb-1" style={{ fontSize: "0.875rem", opacity: 0.9 }}>
          {file.file_name}
        </p>
        <p className="mb-0" style={{ fontSize: "0.75rem", opacity: 0.6 }}>
          {formatFileSize(file.file_size)}
        </p>
      </div>
    );
  };

  return (
    <div className="mt-2">
      {/* Grilla de miniaturas */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginTop: "0.5rem",
        }}
      >
        {files.map((file, index) => {
          const isImage = isImageFile(file.file_name);

          return (
            <div
              key={index}
              onClick={() =>
                isImage ? handleImageClick(file) : handleFileClick(file)
              }
              title={`${file.file_name} (${formatFileSize(file.file_size)})`}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
                border: "2px solid #dee2e6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                background: isImage ? "transparent" : "#f8f9fa",
                position: "relative",
                transition: "border-color 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "#6366f1";
                (e.currentTarget as HTMLDivElement).style.transform =
                  "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "#dee2e6";
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
              }}
            >
              {isImage ? (
                <>
                  <img
                    src={file.file_url}
                    alt={file.file_name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {/* Overlay con icono de lupa al hacer hover */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = "0";
                    }}
                  >
                    <i
                      className="fas fa-search-plus"
                      style={{ color: "white", fontSize: "1.25rem" }}
                    ></i>
                  </div>
                </>
              ) : (
                <>
                  <i
                    className={getFileIcon(file.file_name)}
                    style={{ fontSize: "2rem", marginBottom: "4px" }}
                  ></i>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      textAlign: "center",
                      padding: "0 4px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                      color: "#6c757d",
                    }}
                  >
                    {file.file_name.split(".").pop()?.toUpperCase()}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Galleria - solo se activa si hay imagenes */}
      {imageFiles.length > 0 && (
        <Galleria
          value={imageFiles}
          activeIndex={activeIndex}
          onItemChange={(e) => setActiveIndex(e.index)}
          visible={galleriaVisible}
          onHide={() => setGalleriaVisible(false)}
          item={itemTemplate}
          thumbnail={thumbnailTemplate}
          caption={captionTemplate}
          numVisible={5}
          circular
          fullScreen
          showItemNavigators
          showThumbnails={imageFiles.length > 1}
          showItemNavigatorsOnHover
          style={{ maxWidth: "90vw" }}
        />
      )}
    </div>
  );
}; 