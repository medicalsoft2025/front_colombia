<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="inventoryMovementModalRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        InventoryMovementReport
    } from './react-dist/inventory/reports/InventoryMovementReport.js';

    const rootElement = document.getElementById('inventoryMovementModalRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(InventoryMovementReport));
</script>

<?php include "../footer.php"; ?>