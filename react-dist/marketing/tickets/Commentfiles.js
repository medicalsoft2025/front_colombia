import React, { useState } from "react";
import { Galleria } from "primereact/galleria";
import { isImageFile, getFileIcon, formatFileSize } from "./utils/ticketUtils.js";
export const CommentFiles = ({
  files
}) => {
  const [galleriaVisible, setGalleriaVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  if (!files || files.length === 0) return null;

  // Filtramos solo las imagenes para pasarselas a la Galleria
  const imageFiles = files.filter(f => isImageFile(f.file_name));
  const handleImageClick = file => {
    const index = imageFiles.findIndex(f => f.file_name === file.file_name);
    setActiveIndex(index);
    setGalleriaVisible(true);
  };
  const handleFileClick = file => {
    window.open(file.file_url, "_blank");
  };

  // Template de la imagen principal en la Galleria
  const itemTemplate = file => {
    return /*#__PURE__*/React.createElement("img", {
      src: file.file_url,
      alt: file.file_name,
      style: {
        maxWidth: "100%",
        maxHeight: "80vh",
        objectFit: "contain",
        display: "block",
        margin: "0 auto"
      }
    });
  };

  // Template de las miniaturas en la barra inferior de la Galleria
  const thumbnailTemplate = file => {
    return /*#__PURE__*/React.createElement("img", {
      src: file.file_url,
      alt: file.file_name,
      style: {
        width: "60px",
        height: "45px",
        objectFit: "cover",
        borderRadius: "4px"
      }
    });
  };

  // Template del caption con nombre y tamaño del archivo
  const captionTemplate = file => {
    return /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("p", {
      className: "mb-1",
      style: {
        fontSize: "0.875rem",
        opacity: 0.9
      }
    }, file.file_name), /*#__PURE__*/React.createElement("p", {
      className: "mb-0",
      style: {
        fontSize: "0.75rem",
        opacity: 0.6
      }
    }, formatFileSize(file.file_size)));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-2"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      marginTop: "0.5rem"
    }
  }, files.map((file, index) => {
    const isImage = isImageFile(file.file_name);
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      onClick: () => isImage ? handleImageClick(file) : handleFileClick(file),
      title: `${file.file_name} (${formatFileSize(file.file_size)})`,
      style: {
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
        transition: "border-color 0.2s, transform 0.2s"
      },
      onMouseEnter: e => {
        e.currentTarget.style.borderColor = "#6366f1";
        e.currentTarget.style.transform = "scale(1.05)";
      },
      onMouseLeave: e => {
        e.currentTarget.style.borderColor = "#dee2e6";
        e.currentTarget.style.transform = "scale(1)";
      }
    }, isImage ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
      src: file.file_url,
      alt: file.file_name,
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0,
        transition: "opacity 0.2s"
      },
      onMouseEnter: e => {
        e.currentTarget.style.opacity = "1";
      },
      onMouseLeave: e => {
        e.currentTarget.style.opacity = "0";
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-search-plus",
      style: {
        color: "white",
        fontSize: "1.25rem"
      }
    }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: getFileIcon(file.file_name),
      style: {
        fontSize: "2rem",
        marginBottom: "4px"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "0.6rem",
        textAlign: "center",
        padding: "0 4px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        width: "100%",
        color: "#6c757d"
      }
    }, file.file_name.split(".").pop()?.toUpperCase())));
  })), imageFiles.length > 0 && /*#__PURE__*/React.createElement(Galleria, {
    value: imageFiles,
    activeIndex: activeIndex,
    onItemChange: e => setActiveIndex(e.index),
    visible: galleriaVisible,
    onHide: () => setGalleriaVisible(false),
    item: itemTemplate,
    thumbnail: thumbnailTemplate,
    caption: captionTemplate,
    numVisible: 5,
    circular: true,
    fullScreen: true,
    showItemNavigators: true,
    showThumbnails: imageFiles.length > 1,
    showItemNavigatorsOnHover: true,
    style: {
      maxWidth: "90vw"
    }
  }));
};