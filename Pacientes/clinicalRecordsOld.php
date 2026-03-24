<?php
include "../menu.php";
include "../header.php";
?>

<div class="componente">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="homeMarketing">Pacientes</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Historias Clinicas antiguas
                </li>
            </ol>
        </nav>
        <div class="container">
            <div id="clinicalRecordsOld"></div>
        </div>
    </div>
</div>

<?php
include "../footer.php";
?>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        ClinicalRecordsOldApp
    } from './react-dist/patients/clinicalRecordsOld/ClinicalRecordsOldApp.js';

    ReactDOMClient.createRoot(document.getElementById('clinicalRecordsOld')).render(React.createElement(ClinicalRecordsOldApp));
</script>

<!-- <script>
    document.addEventListener("DOMContentLoaded", function() {
        loadClinicalRecords();
    });
    async function loadClinicalRecords() {
        try {
            const clinicalRecords = await fetch(
                `https://erp.medicalsoft.ai/ba001/migracion.php?action=show&client_id=1246&patient_id=115&tabla=Historia_Clinica_Audiologica`,
            );
            const response = await clinicalRecords.json();
            console.log("response", response);
        } catch (error) {
            console.log("Error al traer historias del 1.0:", error);
        }
    }
</script> -->