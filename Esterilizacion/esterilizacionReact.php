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
                    <li class="breadcrumb-item active" onclick="location.reload()">Esterilización</li>
                </ol>
            </nav>
            <div id="esterilizacionRoot"></div>
        </div>
    </div>
</div>

<script type="module">
    import { Sterilization } from './react-dist/sterilization/components/Sterilization.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(Sterilization, "esterilizacionRoot");
</script>

<?php include "../footer.php"; ?>