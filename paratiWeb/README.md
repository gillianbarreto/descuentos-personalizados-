# Web Descuentos personalizados

## Objetivo principal

Incentivar la descarga del app.

## Descripción

- Un usuario no registrado puede navegar con ciertas limitaciones. Por ejemplo, en el detalle del descuento no se pueden ver todas las tabs o a partir de la segunda página del listado de descuentos, se muestra una invitación para descargar el app. 
- Presenta carrousel de descuentos por categoría, con un máximo de 9 descuentos y opción para listar "Todos los descuentos". Los descuentos varían según el usuario logeado (personalizados), o en su defecto, se muestran descuentos generales.
- Solicita permiso para obtener localización del usuario en *home* para indicar descuentos cercanos y en *benefits-detail* para mostrar sedes en orden de cercanía. No requiere login de usuario. 
- Permite realizar una búsqueda de descuentos por palabra y los resultados se pueden filtrar por categoría. La búsqueda se realiza en los tags asociados al descuento. 
- Presenta detalle del descuento (descripción, términos y condiciones, ubicación por sede) con enlace al link de la fuente del descuento. En el mapa de ubicación se puede marcar la ruta para llegar al establecimiento.
- Si el usuario está logeado, puede marcar descuentos como Favoritos o Ver Más Tarde y posteriormente obtener una lista de ellos. De igual manera puede marcarlo como Me Interesa y No Me Interesa. Estos flags se usan para la construcción del modelo. 
- Al acceder desde un dispositivo Android solicita permiso para crear un acceso directo en la pantalla principal, y poder utilizar la web como si fuera una aplicación (PWA)
- Guarda tracking a medida que el usuario interactúa con la pantalla de registro. 

## Tecnologías usadas

Desarrollado con Angular 6, Bootstrap 4, FontAwesome 4.7. 
Gestiona SSR con *Angular Universal* y manejo de Caché a través de *Service Workers*. 
Configurada como PWA 

Utiliza las siguientes librerías:

- *ngui-map*: para gestión de mapa en detalle de descuento.
- *angular-confirmation-popover*: para confirmar eliminación de descuento de la Lista de Favoritos o Ver Más Tarde
- *videogular2*: para proyección del video promocional.
- *ngx-loading*: para loading en páginas de detalle y lista de descuentos.
- *ngx-pagination*: para paginación en lista de descuento
- *angular4-social-login*: para login con facebook.
- *paper-kit*: plantilla tomada como base para desarrollo inicial.

## Componentes principales

- **home**: muestra una sección de bienvenida para invitar a la descarga de la aplicación, seguido del contador de descuentos, video de promoción y lista de carrousel de descuentos por categorías.
- **benefits-detail**: muestra detalle del beneficio. Es llamado desde *benefits-list* o desde *home*. Recibe el ID del Beneficio.
- **benefits-list**: muestra la lista de beneficios. Es llamado desde *home* mostrando los resultados de la búsqueda o todos los descuentos de la categoría seleccionada en la lista de carrousel (botón "Ver Todos"). También se accede desde la barra de navegación para mostrar la lista de Favoritos ó la lista de descuentos marcados como Ver Más tarde. 
- **profile**: muestra datos del usuario y permite modificar las fuentes de suscripción que tiene asociado el usuario y conectarse a través de facebook. Se accede desde la barra de navegación. 
- **not-found**: muestra mensaje de página no encontrada, cuando se indica una ruta que no existe por la barra de direcciones del navegador.
- **signup**: registro de usuarios por correo o conectando con facebook. Se accede desde el modal para login del usuario y desde el mensaje de incentivo de descarga.

## Componentes compartidos

- **benefit-card**: muestra card de cada descuento y deriva a *benefits-detail* al hacer click sobre la imagen o título de descuento.Llama a *benefit-thumb*. Se usa en carrousel y en la lista de beneficios.
- **benefit-thumb**: muestra la imagen del descuentos y gestiona la activación o eliminación flags (Favorito, Me Interesa, No me Interesa, Ver más Tarde). Se usa para cards en carrousel y en lista de beneficios y en el detalle del descuento.
- **downloadapp**: Muestra botones de descarga de la aplicación. 
- **footer**: Muestra footer común del sitio. Es llamado desde *app-root*.
- **form-contact**: muestra y gestiona formulario de contacto (modal) que se accede desde barra de navegación. 
- **login**: muestra y gestiona formulario de login con facebook y correo. Se accede desde barra de navegación y mensaje de incentivo de descarga. 
- **navbar**: Presenta la barra de navegación que contiene el logo ParaTi, el formulario de búsqueda de descuento y acceso a:
    - Enviar Mensaje de Contacto
    - FanPage de facebook 
    - Blog de ParaTi
    - Login (si no hay usuario conectado)
    - Lista de Favoritos, Lista de Ver Más Tarde y acceso a Edición de Perfil y Logout (si hay usuario conectado)
    Se accede desde *app-root*
- **navigate-back**: muestra botón para volver a navegación anterior. Se usa en *profile*, *benefit-list* y *benefit-detail*.
- **rubros**: muestra lista de carrousel de categorías de descuentos. Es llamado desde *home*. 
- **section-carrousel**: muestra cada sección de categorías. Es llamado desde *rubros*.
- **show-alert**: muestra mensaje tipo alert. Es llamado desde *profile* y *login*.
- **show-images**: muestra la imagen. Es llamado desde *benefit-thumb*.
- **show-incentive**: muestra mensaje de incentivo de descarga. Es llamado desde *benefit-list* y *benefit-detail*.
- **show-legal**: muestra modal de Términos y Condiciones de uso del app. Es usado por *signup* y *footer*
- **show-logo**: muestra logo ParaTi.
- **show-message**: muestra mensaje de error o advertencia, invitando a descarga de la aplicación. 

## Servicios

- **authentication.service**: gestiona servicios de autenticación del usuario, registro y actualización de datos. Es usado por *login* y *profile*.
- **benefits.service**: gestiona servicios para obtener datos de descuentos. Es usado por *benefit-list*, *benefit-detail* y *home* 
- **storage.service**: gestiona servicios para uso del localStorage. Es usado por todos los componentes principales y algunos secundarios. 

## Otros

- **setting-benefits**: define interface para datos de descuentos.
- **setting-session**: define interfaces para datos de usuarios.
- **shared.data**: define data de uso global (URL de API)
- **shared.module**: importa módulos de uso común para componentes principales.

## Para servir la aplicación localmente

**ng serve**  
Sirve la aplicación el http://localhost:4200

**npm run build:ssr**
Construir la aplicación para producción. Genera dos directorios en /dist: 
    - browser: archivos requeridos para la aplicación en el navegador.
    - server: archivos para renderizar en servidor.

**npm run serve:ssr**
Sirve la aplicación renderizada en http://localhost:4000 con un servidor Node.js