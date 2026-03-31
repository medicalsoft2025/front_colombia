import React, { useState } from "react";
import { FileComment } from "./utils/interfaces";
import { isImageFile, getFileIcon, formatFileSize } from "./utils/ticketUtils";

interface FilesCommentProps {
  files: FileComment[] | null;
}

export const FilesComment: React.FC<FilesCommentProps> = ({ files }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!files || files.length === 0) return null;

  const handleClick = (file: FileComment) => {
    window.open(file.file_url, "_blank");
  };

  return (
    <div className="mt-2">
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
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              onClick={() => handleClick(file)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              title={`${file.file_name} (${formatFileSize(file.file_size)}) - Click para abrir`}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
                border: `2px solid ${isHovered ? "#6366f1" : "#dee2e6"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "4px",
                background: isHovered ? "#f0f0ff" : "#f8f9fa",
                position: "relative",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
                transition: "all 0.2s",
              }}
            >
              <i
                className={isImage ? "fas fa-image text-primary" : getFileIcon(file.file_name)}
                style={{ fontSize: "2rem" }}
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
                  fontWeight: 600,
                }}
              >
                {file.file_name.split(".").pop()?.toUpperCase()}
              </span>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(99, 102, 241, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.2s",
                  pointerEvents: "none",
                }}
              >
                <i
                  className="fas fa-external-link-alt"
                  style={{ color: "#6366f1", fontSize: "1rem", position: "absolute", top: "6px", right: "6px" }}
                ></i>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};