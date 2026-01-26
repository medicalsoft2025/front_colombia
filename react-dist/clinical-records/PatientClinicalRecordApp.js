import React from "react";
import { PrimeReactProvider } from "primereact/api";
import { useSpecializables } from "../specializables/hooks/useSpecializables.js";
import { useEffect } from "react";
import { useState } from "react";
import { useClinicalRecordTypes } from "../clinical-record-types/hooks/useClinicalRecordTypes.js";
import { useClinicalRecords } from "./hooks/useClinicalRecords.js";
import { PatientClinicalRecordsTable } from "./components/PatientClinicalRecordsTable.js";
import UserManager from "../../services/userManager.js";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF.js";
import { SeePatientInfoButton } from "../patients/SeePatientInfoButton.js";
import { Button } from "primereact/button";
import { usePatient } from "../patients/hooks/usePatient.js";
import { consentimientoService } from "../../services/api/index.js";
const specialtyId = new URLSearchParams(window.location.search).get("especialidad");
const patientId = new URLSearchParams(window.location.search).get("patient_id") || new URLSearchParams(window.location.search).get("id") || "";
const appointmentId = new URLSearchParams(window.location.search).get("appointment_id") || "";
export const PatientClinicalRecordApp = () => {
  const {
    specializables
  } = useSpecializables();
  const {
    clinicalRecordTypes
  } = useClinicalRecordTypes();
  const {
    clinicalRecords
  } = useClinicalRecords(patientId);
  const {
    patient
  } = usePatient(patientId);
  const [tableClinicalRecords, setTableClinicalRecords] = useState([]);
  const [specialtyClinicalRecords, setSpecialtyClinicalRecords] = useState([]);
  useEffect(() => {
    if (specializables && clinicalRecordTypes) {
      const specialtyClinicalRecordIds = specializables.filter(record => record.specialty_id === specialtyId && ["Historia Clínica", "clinical_record"].includes(record.specializable_type)).map(record => record.specializable_id.toString());
      const filteredClinicalRecords = clinicalRecordTypes.filter(record => specialtyClinicalRecordIds.includes(record.id.toString()));
      const mappedClinicalRecords = filteredClinicalRecords.map(record => {
        let url = `consultas?patient_id=${patientId}&especialidad=${specialtyId}&dynamic_form_id=${record.dynamic_form_id}&clinical_record_type_id=${record.id}&tipo_historia=${record.key_}&appointment_id=${appointmentId}`;
        if (record.dynamic_form_id) {
          url = `clinicalRecordForm?patient_id=${patientId}&especialidad=${specialtyId}&dynamic_form_id=${record.dynamic_form_id}&clinical_record_type_id=${record.id}&tipo_historia=${record.key_}&appointment_id=${appointmentId}`;
        }
        return {
          ...record,
          url: url
        };
      });
      setSpecialtyClinicalRecords(mappedClinicalRecords);
      setTableClinicalRecords(clinicalRecords.filter(record => specialtyClinicalRecordIds.includes(record.clinical_record_type_id.toString())));
    }
  }, [specializables, clinicalRecordTypes, clinicalRecords]);
  useEffect(() => {
    if (specializables) {
      const specialtyClinicalRecordIds = specializables.filter(record => record.specialty_id === specialtyId && record.specializable_type === "Historia Clínica").map(record => record.specializable_id.toString());
      setTableClinicalRecords(clinicalRecords.filter(record => specialtyClinicalRecordIds.includes(record.clinical_record_type_id.toString())));
    }
  }, [specializables, clinicalRecords]);
  useEffect(() => {
    console.log("Paciente: ", patient);
  }, [patient]);
  const printClinicalRecord = (data, title) => {
    const clinicalRecord = clinicalRecords.find(record => record.id == data.id);
    if (clinicalRecord?.clinical_record_type?.dynamic_form_id) {
      consentimientoService.previewPdf({
        model_type: "App\\Models\\ClinicalRecord",
        model_id: data.id
      });
      return;
    }
    //@ts-ignore
    generarFormato("Consulta", data, "Impresion");
    // crearDocumento(id, "Impresion", "Consulta", "Completa", title);
  };
  const downloadClinicalRecord = (id, title) => {
    const clinicalRecord = clinicalRecords.find(record => record.id == id);
    if (clinicalRecord?.clinical_record_type?.dynamic_form_id) {
      consentimientoService.downloadPdf({
        model_type: "App\\Models\\ClinicalRecord",
        model_id: id
      });
      return;
    }
    //@ts-ignore
    generarFormato("Consulta", id, "Descarga");
    // crearDocumento(id, "Descarga", "Consulta", "Completa", title);
  };
  const shareClinicalRecord = (id, type, title, patient_id) => {
    switch (type) {
      case "whatsapp":
        //@ts-ignore
        enviarDocumento(id, "Descarga", "Consulta", "Completa", patient_id, UserManager.getUser().id, title);
        break;
      default:
        break;
    }
  };
  const seeDetail = (id, clinicalRecordTypeObject) => {
    if (clinicalRecordTypeObject.dynamic_form_id) {
      consentimientoService.previewPdf({
        model_type: "App\\Models\\ClinicalRecord",
        model_id: id
      });
      return;
    } else {
      window.location.href = `detalleConsulta?clinicalRecordId=${id}&patient_id=${patientId}&tipo_historia=${clinicalRecordTypeObject.key_}&especialidad=${specialtyId}`;
    }
  };
  const nombreEspecialidad = new URLSearchParams(window.location.search).get("especialidad");
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "mb-0"
  }, "Historias Cl\xEDnicas - ", nombreEspecialidad)), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2 justify-content-end"
  }, /*#__PURE__*/React.createElement(SeePatientInfoButton, {
    patientId: patientId
  }), patient && (patient.current_appointment || appointmentId) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dropdown"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Crear Historia Cl\xEDnica",
    className: "p-button-primary",
    type: "button",
    id: "dropdownMenuButton",
    "data-bs-toggle": "dropdown",
    "aria-expanded": "false"
  }), /*#__PURE__*/React.createElement("ul", {
    className: "dropdown-menu ",
    "aria-labelledby": "dropdownMenuButton"
  }, specialtyClinicalRecords.map(record => /*#__PURE__*/React.createElement("li", {
    key: record.id
  }, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    href: record.url
  }, /*#__PURE__*/React.createElement("strong", null, "Crear", " ", record.name))))))))))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-4"
  }, /*#__PURE__*/React.createElement(PatientClinicalRecordsTable, {
    records: tableClinicalRecords,
    onSeeDetail: seeDetail,
    onPrintItem: printClinicalRecord,
    onDownloadItem: downloadClinicalRecord,
    onShareItem: shareClinicalRecord
  })));
};