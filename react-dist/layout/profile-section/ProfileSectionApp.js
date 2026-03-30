import React, { useRef } from "react";
import { PrimeReactProvider } from "primereact/api";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { userService } from "../../../services/api/index.js";
import { useProfileSection } from "./hooks/useProfileSection.js";
import { getUserCountryUrlPrefix } from "../../../services/utilidades.js";
import { useQueryClient } from "@tanstack/react-query";
export const ProfileSectionApp = () => {
  const queryClient = useQueryClient();
  const {
    user,
    loading
  } = useProfileSection();
  const op = useRef(null);
  const handleToggle = e => {
    // Forzar la actualización de posición antes de abrir
    if (op.current) {
      op.current.toggle(e);
      // Forzar recalcular posición después de un pequeño delay
      setTimeout(() => {
        if (op.current) {
          op.current.align(e);
        }
      }, 100);
    }
  };
  async function cerrarSesion() {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Seguro que quieres salir de la aplicación?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar"
    }).then(async result => {
      if (result.isConfirmed) {
        await userService.logout();
        const userCountryUrlPrefix = getUserCountryUrlPrefix();
        queryClient.removeQueries();
        sessionStorage.clear();
        localStorage.clear();
        Swal.fire("¡Sesión cerrada!", "Has salido correctamente.", "success").then(() => {
          window.location.href = `${userCountryUrlPrefix}/inicio`;
        });
      }
    });
  }
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center"
  }, /*#__PURE__*/React.createElement(Avatar, {
    image: user?.minio_url ? user?.imageUrlMinio : "",
    label: `${user?.first_name.charAt(0) ?? user?.middle_name.charAt(0)}`,
    size: "large",
    shape: "circle",
    onClick: handleToggle
  }), /*#__PURE__*/React.createElement(OverlayPanel, {
    ref: op
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement(Avatar, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-user"
    }),
    image: user?.minio_url ? user?.imageUrlMinio : "",
    size: "xlarge",
    shape: "circle",
    onClick: handleToggle
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-100 text-center"
  }, /*#__PURE__*/React.createElement("h5", null, `${user?.first_name || ""} ${user?.middle_name || ""} ${user?.last_name || ""} ${user?.second_last_name || ""}`), /*#__PURE__*/React.createElement("h4", null, `${user?.role.name || ""} | ${user?.specialty.name || ""}`), /*#__PURE__*/React.createElement("h5", null, "Consultorio: ", ` ${user?.dayOffice || "Sin consultorio"}`), /*#__PURE__*/React.createElement(Button, {
    id: "btn-logout",
    label: "Cerrar sesi\xF3n",
    className: "mt-3",
    onClick: () => {
      cerrarSesion();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-right-to-bracket ms-2"
  })))))), /*#__PURE__*/React.createElement("style", null, `
          .p-overlaypanel-content {
            padding-right: 0 !important;
            padding-left: 0 !important;
            padding-top: 1.25rem;
            padding-bottom: 1.25rem;
          }
        `));
};