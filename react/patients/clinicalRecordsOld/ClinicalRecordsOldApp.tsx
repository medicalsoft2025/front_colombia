import React, { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { tenantConfigService, patientService } from "../../../services/api";
import { PrimeReactProvider } from "primereact/api";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";

export const ClinicalRecordsOldApp = () => {
  const patientId = new URLSearchParams(window.location.search).get(
    "patient_id",
  );
  const [clinicalRecords, setClinicalRecords] = useState<any[]>([]);
  const [clinicalRecordsOptions, setClinicalRecordsOptions] = useState<any[]>(
    [],
  );
  const [selectedClinicalRecord, setSelectedClinicalRecord] =
    useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Función para decodificar texto con caracteres mal codificados
  const decodeText = (text: string) => {
    if (!text) return text;

    try {
      // Primero decodificar HTML entities
      const textarea = document.createElement("textarea");
      textarea.innerHTML = text;
      let decoded = textarea.value;

      // Corregir caracteres mal codificados (Ã¡, Ã©, Ã­, Ã³, Ãº, etc.)
      const charMap: { [key: string]: string } = {
        "Ã¡": "á",
        "Ã©": "é",
        "Ã­": "í",
        "Ã³": "ó",
        Ãº: "ú",
        "Ã±": "ñ",
        "Ã‘": "Ñ",
        "Ã¼": "ü",
        "Ã„": "Ä",
        "Ã–": "Ö",
        Ãœ: "Ü",
        "Â¿": "¿",
        "Â¡": "¡",
        "Ã‚": "Â",
        "Ã€": "À",
        Ãƒ: "Ã",
        "â€“": "-",
        "â€™": "'",
        "â€œ": '"',
        "â€\u009d": '"',
      };

      let corrected = decoded;
      for (const [wrong, correct] of Object.entries(charMap)) {
        corrected = corrected.replace(new RegExp(wrong, "g"), correct);
      }

      return corrected;
    } catch (error) {
      console.error("Error decodificando texto:", error);
      return text;
    }
  };

  // Función para formatear el nombre de la clave
  const formatKeyName = (key: string) => {
    // Decodificar la key también
    const decodedKey = decodeText(key);
    return decodedKey
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .trim();
  };

  async function loadClinicalRecords(table: string = "") {
    setLoading(true);
    try {
      const tenantConfig = await tenantConfigService.getConfig();
      const patient = await patientService.get(patientId);
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      let dataMapped: any = [];
      if (table !== "") {
        const url = new URL(
          `https://erp.medicalsoft.ai/ba001/migracion.php?action=show&client_id=${tenantConfig?.cod_client}&patient_id=${Number(patient?.external_medical_old_id)}&tabla=${table}`,
        );
        const clinicalRecords = await fetch(url.toString(), {
          method: "GET",
          headers,
        });
        const response = await clinicalRecords.json();
        dataMapped = response.records.map((item: any) => {
          const { id, fecha, cliente_id, usuario_id, ...clinicalRecordData } =
            item;

          // Decodificar los valores de clinicalRecordData
          const decodedClinicalRecordData: any = {};
          for (const [key, value] of Object.entries(clinicalRecordData)) {
            decodedClinicalRecordData[key] =
              typeof value === "string" ? decodeText(value) : value;
          }

          return {
            id,
            fecha: decodeText(fecha),
            cliente_id,
            usuario_id,
            clinicalRecordData: decodedClinicalRecordData,
          };
        });
      }
      setClinicalRecords(dataMapped);
    } catch (error) {
      console.error("Error al traer historias del 1.0:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadClinicalRecordsToPatient() {
    try {
      const tenantConfig = await tenantConfigService.getConfig();
      const patient = await patientService.get(patientId);
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const url = new URL(
        `https://erp.medicalsoft.ai/ba001/migracion.php?action=index&client_id=${tenantConfig?.cod_client}&patient_id=${Number(patient?.external_medical_old_id)}`,
      );
      const clinicalRecords = await fetch(url.toString(), {
        method: "GET",
        headers,
      });
      const response = await clinicalRecords.json();
      const dataMapped = response.historias.map((item: any) => {
        return {
          ...item,
          name: formatKeyName(item.tabla),
        };
      });
      setClinicalRecordsOptions(dataMapped);
    } catch (error) {
      console.error("Error al traer historias del 1.0:", error);
    }
  }

  useEffect(() => {
    loadClinicalRecords();
    loadClinicalRecordsToPatient();
  }, []);

  return (
    <PrimeReactProvider>
      <Card>
        <h3 className="p-3">Historias clinicas</h3>
        <div className="d-flex flex-column m-3">
          <label htmlFor="clinicalRecordoptions">Historias clinicas</label>
          <Dropdown
            value={selectedClinicalRecord}
            onChange={(e) => {
              setSelectedClinicalRecord(e.value);
              loadClinicalRecords(e.value);
            }}
            options={clinicalRecordsOptions}
            optionLabel="name"
            optionValue="tabla"
            placeholder="Seleccione una historia clinica"
            filter
          />
        </div>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center p-5">
            <ProgressSpinner />
          </div>
        ) : (
          <Accordion activeIndex={0}>
            {clinicalRecords.map((item: any) => (
              <AccordionTab
                key={item.id}
                header={"Historia clinica: " + item.id + " / " + item.fecha || ""}
              >
                <div className="p-3">
                  {Object.entries(item.clinicalRecordData).map(
                    ([key, value]: [string, any]) => (
                      <div key={key} className="mb-4">
                        <h4 className="font-bold text-lg mb-2">
                          {formatKeyName(key)}
                        </h4>
                        <div
                          dangerouslySetInnerHTML={{ __html: value }}
                          className="border rounded p-3 bg-gray-50"
                        />
                      </div>
                    ),
                  )}
                </div>
              </AccordionTab>
            ))}
          </Accordion>
        )}
      </Card>
    </PrimeReactProvider>
  );
};
