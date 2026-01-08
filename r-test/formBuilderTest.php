<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
        <div id="formBuilderRoot"></div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        FormBuilder
    } from './react-dist/form-builder/components/FormBuilder.js';

    const rootElement = document.getElementById('formBuilderRoot');

    ReactDOMClient.createRoot(rootElement).render(React.createElement(FormBuilder));
</script>

<?php include "../footer.php"; ?>