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
                    <li class="breadcrumb-item active" onclick="location.reload()">Antecedentes Familiares</li>
                </ol>
            </nav>
            <div id="antecedentesFamiliaresRoot"></div>
        </div>
    </div>
</div>

<script type="module">
    import { FamilyMemberHistory } from './react-dist/family-member-history/components/FamilyMemberHistory.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(FamilyMemberHistory, "antecedentesFamiliaresRoot", { patientId: new URLSearchParams(window.location.search).get("patientId") || new URLSearchParams(window.location.search).get("id") || new URLSearchParams(window.location.search).get("patient_id") || 0 });
</script>

<?php include "../footer.php"; ?>