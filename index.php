<?php
include 'public_header.php';
?>
  <script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
      LoginApp
    } from './react-dist/login/LoginApp.js';

    const appointmentFormModalRef = React.createRef();

    document.addEventListener('DOMContentLoaded', function() {
      const rootElement = document.getElementById('LoginApp');
      ReactDOMClient.createRoot(rootElement).render(React.createElement(LoginApp));
    });
  </script>
</body>

</html>