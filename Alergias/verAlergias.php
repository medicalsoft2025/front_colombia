<?php
include "../menu.php";
include "../header.php";
?>

<div class="componente">
    <div class="content">
        <div class="container-small">
            <nav class="mb-4" aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Alergias</li>
                </ol>
            </nav>
            <div id="alergiasRoot"></div>
        </div>
    </div>
</div>

<script type="module">
    import { Allergies } from './react-dist/allergies/components/Allergies.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(Allergies, "alergiasRoot", { patientId: new URLSearchParams(window.location.search).get("patientId") || new URLSearchParams(window.location.search).get("id") || new URLSearchParams(window.location.search).get("patient_id") || 0 });
</script>

<?php include "../footer.php"; ?>