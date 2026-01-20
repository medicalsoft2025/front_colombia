<?php
include "../public_header.php";
?>


<div class="main-content">
    <div class="component-container">
        <div id="asignar-consentimiento"></div>
    </div>
</div>

<script type="module">
    import PublicSignature from '../../react-dist/config/asignar-consentimiento/PublicSignature.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(PublicSignature, "asignar-consentimiento");
</script>

<?php
include "../footer.php";
?>