import React, { useCallback, useEffect, useRef, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { userService } from "../../../services/api";
import { useProfileSection } from "./hooks/useProfileSection.js";
import { getUserCountryUrlPrefix } from "../../../services/utilidades.js";
import { useQueryClient } from "@tanstack/react-query";

export const ProfileSectionApp: React.FC<any> = () => {
  const queryClient = useQueryClient();
  const { user, loading } = useProfileSection();

  const op: any = useRef(null);

  const handleToggle = (e: React.MouseEvent) => {
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
      cancelButtonText: "Cancelar",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        await userService.logout();
        const userCountryUrlPrefix = getUserCountryUrlPrefix();
        queryClient.removeQueries();
        sessionStorage.clear();
        localStorage.clear();
        Swal.fire(
          "¡Sesión cerrada!",
          "Has salido correctamente.",
          "success",
        ).then(() => {
          window.location.href = `${userCountryUrlPrefix}/inicio`;
        });
      }
    });
  }

  return (
    <PrimeReactProvider>
      <div className="d-flex justify-content-center">
        <Avatar
          image={user?.minio_url ? user?.imageUrlMinio : ""}
          label={`${user?.first_name.charAt(0) ?? user?.middle_name.charAt(0)}`}
          size="large"
          shape="circle"
          onClick={handleToggle}
        />
        <OverlayPanel ref={op}>
          <div className="d-flex justify-content-center flex-wrap gap-2">
            <Avatar
              icon={<i className="fas fa-user"></i>}
              image={user?.minio_url ? user?.imageUrlMinio : ""}
              size="xlarge"
              shape="circle"
              onClick={handleToggle}
            />
            <div className="w-100 text-center">
              <h5>{`${user?.first_name || ""} ${user?.middle_name || ""} ${user?.last_name || ""} ${user?.second_last_name || ""}`}</h5>
              <h4>{`${user?.role.name || ""} | ${user?.specialty.name || ""}`}</h4>
              <h5>Consultorio: {` ${user?.dayOffice || "Sin consultorio"}`}</h5>
              <Button
                id="btn-logout"
                label="Cerrar sesión"
                className="mt-3"
                onClick={() => {
                  cerrarSesion();
                }}
              >
                <i className="fas fa-right-to-bracket ms-2"></i>
              </Button>
            </div>
          </div>
        </OverlayPanel>
      </div>
      <style>
        {`
          .p-overlaypanel-content {
            padding-right: 0 !important;
            padding-left: 0 !important;
            padding-top: 1.25rem;
            padding-bottom: 1.25rem;
          }
        `}
      </style>
    </PrimeReactProvider>
  );
};
