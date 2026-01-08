<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="patientEvolutionsRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        PatientEvolutions
    } from './react-dist/patient-evolutions/components/PatientEvolutions.js';

    const appointmentFormModalRef = React.createRef();

    const rootElement = document.getElementById('patientEvolutionsRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(PatientEvolutions));
</script>

<?php include "../footer.php"; ?>