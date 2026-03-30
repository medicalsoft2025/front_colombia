<style>
    * {
        font-size: large;
    }
</style>
<style>
    /* Estilos para el dropdown de Choices */
    .choices__list--dropdown .choices__item--selectable {
        color: #333;
        /* Color del texto normal */
        padding: 8px 10px;
    }

    /* Cuando se hace hover */
    .choices__list--dropdown .choices__item--selectable:hover,
    .choices__list--dropdown .choices__item--selectable.is-highlighted {
        background-color: #f5f5f5;
        /* Color de fondo al hacer hover */
        color: #333 !important;
        /* Color del texto al hacer hover */
    }

    /* Opcional: estilo para el placeholder */
    .choices__list--dropdown .choices__placeholder {
        color: #999;
    }

    .navbar .dropdown-menu.dropdown-menu-end.navbar-dropdown-caret {
        /* Tus estilos existentes */
        width: auto !important;
        right: 0 !important;
    }

    /* Ajustar el espaciado entre elementos */
    .row-custom {
        gap: 30px;
        /* Espacio entre elementos */
    }

    /* Asegurar que el texto no se desborde */
    .text-truncate {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>


<link rel="stylesheet" href="fuentes/fuentes.css">
<nav class="navbar navbar-top fixed-top navbar-expand-lg" id="navbarCombo" data-navbar-top="combo"
    data-move-target="#navbarVerticalNav">
    <div class="w-100 d-flex gap-2 align-items-center">

        <div id="logoReact" class="d-flex"></div>

        <div className="d-flex flex-grow-1 mb-4" style="width: 100%;">
            <div id="NavbarHeader"></div>
        </div>

        <div class="d-flex">
            <div id="profile-section">
            </div>
        </div>

    </div>
    </div>
</nav>

<script src="./funciones/funcionesJS/utils.js"></script>

<script type="module">
    import NavbarHeader from './react-dist/layout/menu/NavbarHeader.js';
    import {ProfileSectionApp} from './react-dist/layout/profile-section/ProfileSectionApp.js';
    import {
        Logo
    } from './react-dist/components/Logo.js';
    import {
        renderApp
    } from './services/react/app-renderer.js';

    renderApp(NavbarHeader, 'NavbarHeader');
    renderApp(ProfileSectionApp, 'profile-section');
    renderApp(Logo, 'logoReact');

    import {
        userService
    } from './services/api/index.js';
    import {
        getJWTPayload
    } from "./services/utilidades.js";
    import {
        authMiddleware
    } from "./Middleware/authMiddleware.js";
    import {
        extractDataFromTree
    } from "./services/utilidades.js";


    document.addEventListener('DOMContentLoaded', async function() {
        // Aplicar middleware de autenticación
        // authMiddleware();        
        const user = await userService.getCachedLoggedUser(getJWTPayload().sub);

        if (user) {
            document.querySelectorAll('.username').forEach(element => {
                element.textContent =
                    `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`;
            })
            document.querySelectorAll('.user-role').forEach(element => {
                element.textContent = user.role.name;
            })
            document.querySelectorAll('.user-specialty').forEach(element => {
                if (user.role.group == 'DOCTOR') {
                    element.textContent = ' | ' + user.specialty.name;
                }
            })
            const menu = await userService.getMenuByRole(user.id);

            localStorage.setItem("roles", JSON.stringify(user.role));
            localStorage.setItem("menus", JSON.stringify(menu.menus));

            function extractUrls(menuArray) {
                return extractDataFromTree({
                    tree: menuArray,
                    key: 'url',
                    childrenKey: 'items'
                });
            }


            fetch('./saveMenus', {
                method: 'POST',
                body: JSON.stringify({
                    menus: extractUrls(menu.menus)
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (window.updateNavbarMenus) {
                window.updateNavbarMenus();
            }
            const avatarUrl = getUrlImage(user.minio_url);


            document.querySelectorAll('.user-avatar').forEach(element => {
                element.src = avatarUrl || 'assets/img/profile/profile_default.jpg';
            })

            const adminContainer = document.getElementById('admin-container');
            const doctorContainer = document.getElementById('doctor-container');

            if (user.role.group == 'ADMIN') {

                adminContainer.style.display = 'block';
                const adminContent = document.createElement('p');

                const dayModule = user.availabilities.find(availability => {
                    return availability.days_of_week.includes(new Date().getDay()) && availability
                        .is_active
                }).module.name

                adminContent.textContent = 'Modulo: ' + dayModule;
                adminContainer.appendChild(adminContent);

            } else if (user.role.group == 'DOCTOR') {

                doctorContainer.style.display = 'block';
                const doctorContent = document.createElement('p');

                const dayOffice = user.availabilities.find(availability => {
                    return availability.days_of_week.includes(new Date().getDay())
                })?.office

                doctorContent.textContent = 'Consultorio: ' + (dayOffice || 'Sin consultorio');
                doctorContainer.appendChild(doctorContent);
            }
        }
    })
</script>

<script>
    const themeController = document.body;

    const imgLogo = document.getElementById("imgLogo");

    themeController.addEventListener(
        "clickControl",
        ({
            detail: {
                control,
                value
            }
        }) => {
            if (control === "phoenixTheme") {
                const prStyle = document.getElementById("user-style-pr-default");

                // Obtener el modo del tema
                const mode = value === 'auto' ? window.phoenix.utils.getSystemTheme() : value;

                // Cambiar la imagen según el tema
                if (mode === "dark") {
                    //imgLogo.src = "/logo_monaros_sinbg_dark.png";
                    prStyle.href = `assets/css/bootstrap4pr_dark/theme.css`;
                } else {
                    //imgLogo.src = "/logo_monaros_sinbg_light.png";
                    prStyle.href = `assets/css/bootstrap4pr/theme.css`;
                }

            }
        }
    );

    // NOTIFICACIONES 

    // Objeto que contiene las notificaciones
    const notificationsData = {
        notifications: [{
                id: 1,
                user: {
                    name: "Jessie Samson",
                    avatar: "https://i.pinimg.com/736x/6c/6e/d7/6c6ed7f4011b7f926b3f1505475aba16.jpg",
                    status: "online"
                },
                type: "comment",
                message: "Ha comentado tu post",
                time: "10:41",
                date: "2021-08-07",
                read: false
            },
            {
                id: 2,
                user: {
                    name: "MedicalSoft",
                    avatar: null,
                    initials: "M",
                    status: "online"
                },
                type: "event",
                message: "Ha creado un evento",
                time: "10:20",
                date: "2021-08-07",
                read: false
            },
            {
                id: 3,
                user: {
                    name: "Kiera Anderson",
                    avatar: "https://i.pinimg.com/736x/6c/6e/d7/6c6ed7f4011b7f926b3f1505475aba16.jpg",
                    status: "offline"
                },
                type: "like",
                message: "Le ha gustado tu post",
                time: "09:30",
                date: "2021-08-07",
                read: true
            },
            {
                id: 4,
                user: {
                    name: "Herman Carter",
                    avatar: "https://i.pinimg.com/736x/6c/6e/d7/6c6ed7f4011b7f926b3f1505475aba16.jpg",
                    status: "online"
                },
                type: "appointment",
                message: "Ha solicitado una cita",
                time: "09:11",
                date: "2021-08-07",
                read: false
            },
            {
                id: 4,
                user: {
                    name: "Herman Carter",
                    avatar: "https://i.pinimg.com/736x/6c/6e/d7/6c6ed7f4011b7f926b3f1505475aba16.jpg",
                    status: "online"
                },
                type: "appointment",
                message: "Ha solicitado una cita",
                time: "09:11",
                date: "2021-08-07",
                read: false
            },
            {
                id: 4,
                user: {
                    name: "Herman Carter",
                    avatar: "https://i.pinimg.com/736x/6c/6e/d7/6c6ed7f4011b7f926b3f1505475aba16.jpg",
                    status: "online"
                },
                type: "appointment",
                message: "Ha solicitado una cita",
                time: "09:11",
                date: "2021-08-07",
                read: false
            },
            {
                id: 4,
                user: {
                    name: "Herman Carter",
                    avatar: "https://i.pinimg.com/736x/6c/6e/d7/6c6ed7f4011b7f926b3f1505475aba16.jpg",
                    status: "online"
                },
                type: "appointment",
                message: "Ha solicitado una cita",
                time: "09:11",
                date: "2021-08-07",
                read: false
            }
        ],
        unreadCount: 3
    };

    const notificationIcons = {
        comment: "💬",
        event: "📅",
        like: "👍",
        appointment: "🗓️",
        system: "⚙️",
        default: "🔔"
    };

    function getNotificationIcon(type) {
        return notificationIcons[type] || notificationIcons.default;
    }

    // Función para renderizar las notificaciones
    function renderNotifications() {
        const notificationsContainer = document.getElementById('bodyNotificaciones');

        // Limpiar contenedor primero
        notificationsContainer.innerHTML = '';

        // Ordenar notificaciones (no leídas primero)
        const sortedNotifications = [...notificationsData.notifications].sort((a, b) => {
            const dateTimeA = new Date(`${a.date}T${a.time}`);
            const dateTimeB = new Date(`${b.date}T${b.time}`);
            return dateTimeB - dateTimeA; // Orden descendente (más reciente primero)
        });

        // Crear elementos para cada notificación
        sortedNotifications.forEach(notification => {
            const notificationElement = document.createElement('div');
            notificationElement.className =
                `px-2 px-sm-3 py-3 notification-card position-relative border-bottom ${notification.read ? 'read' : 'unread'}`;

            // Determinar clase de estado (online/offline)
            const statusClass = notification.user.status === 'online' ? 'status-online' : 'status-offline';

            // Crear avatar (imagen o iniciales)
            let avatarHtml;
            if (notification.user.avatar) {
                avatarHtml =
                    `<img class="rounded-circle" src="${notification.user.avatar}" alt="${notification.user.name}">`;
            } else {
                avatarHtml =
                    `<span class="avatar-name rounded-circle bg-primary text-white" style="padding: 0.3rem !important;">${notification.user.initials}</span>`;
            }

            const notificationIcon = getNotificationIcon(notification.type);

            notificationElement.innerHTML = `
      <div class="d-flex align-items-center">
        <div class="avatar avatar-m me-3"">
          ${avatarHtml}
        </div>
        <div class="flex-1 me-sm-3">
          <h6 class="fs-9 text-primary mb-1">${notification.user.name}</h6>
          <p class="fs-9 text-body-highlight mb-1 fw-normal">
            <span class="me-1">${notificationIcon}</span>${notification.message}
          </p>
          <p class="text-body-secondary fs-9 mb-0 d-flex align-items-center">
            <i class="far fa-clock me-1" style="width: 0.7rem; opacity: 0.5"></i>
            <span class="fms-2 text-body-quaternary text-opacity-75 fw-bold fs-10">${notification.time} - ${notification.date}</span>
          </p>
        </div>
        ${!notification.read ? '<span class="position-absolute top-50% end-0 p-1 bg-primary rounded-circle" style="margin-right: 0.3rem"></span>' : ''}
      </div>
    `;

            notificationsContainer.appendChild(notificationElement);
        });

        // Actualizar indicador de notificaciones no leídas
        updateUnreadIndicator();
    }

    // Función para actualizar el indicador de notificaciones no leídas (círculo)
    function updateUnreadIndicator() {
        const unreadCount = notificationsData.notifications.filter(n => !n.read).length;
        const bellIconContainer = document.getElementById('btnNotificaciones');

        // Limpiar cualquier indicador existente
        const existingIndicator = document.getElementById('notification-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Agregar nuevo indicador si hay notificaciones no leídas
        if (unreadCount > 0) {
            const indicator = document.createElement('span');
            indicator.className = 'notification-indicator';
            indicator.id = 'notification-indicator';
            indicator.style.position = 'absolute';
            indicator.style.top = '20%';
            indicator.style.right = '3px';
            indicator.style.width = '0.6rem';
            indicator.style.height = '0.6rem';
            indicator.style.backgroundColor = '#dc3545';
            indicator.style.borderRadius = '50%';
            indicator.style.border = '2px solid white';
            bellIconContainer?.appendChild(indicator);
        }
    }

    // Función para marcar todas las notificaciones como leídas
    function markAllAsRead() {
        notificationsData.notifications.forEach(notification => {
            notification.read = true;
        });
        notificationsData.unreadCount = 0;
        renderNotifications();
    }

    // Inicializar cuando el DOM esté cargado
    document.addEventListener('DOMContentLoaded', function() {
        // Renderizar notificaciones iniciales
        renderNotifications();

        // Asignar evento al botón "Marcar como leídas"
        const markAllButton = document.getElementById('markAllButton');
        if (markAllButton) {
            markAllButton.addEventListener('click', markAllAsRead);
        }
    });
</script>