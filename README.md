# LATINOS EN JEREZ — SIN LÍMITES 🇪🇸🌎

**Versión V5 — 15 noviembre 2026**

Comunidad latina en Jerez de la Frontera: marketplace, servicios, comida, trabajo, alquiler, transporte, amistades y grupos.

## Abrir o instalar

- **Web oficial:** https://suelafirme.github.io/Latinos-en-jerz/
- **APK Android V5:** https://github.com/suelafirme/Latinos-en-jerz/releases/download/v5.0.0/latinos-en-jerez-v5.apk
- **Página del release:** https://github.com/suelafirme/Latinos-en-jerz/releases/tag/v5.0.0

El APK es una **app Android WebView** conectada a la misma web en HTTPS y a Supabase. Requiere Internet. La firma es de desarrollo (beta), no es aún una versión publicada en Google Play.

**Aviso de actualización desde V4:** el APK beta se compiló con claves de desarrollo de GitHub Actions que pueden cambiar entre compilaciones. Si Android rechaza la instalación de V5 sobre V4 por firma incompatible, desinstalar V4 e instalar V5. Los anuncios, perfiles y grupos están guardados en Supabase y no se pierden por desinstalar, pero será necesario iniciar sesión otra vez.

## Funcionalidades V5

- Logo aprobado por la comunidad: bandera española y JEREZ al centro, banderas latinas alrededor; incluido en la web y el icono Android.
- Rediseño mobile-first con colores latinos, portada, galería, tarjetas adaptadas a cada categoría.
- **Publicación inmediata:** anuncios nuevos con status `approved`, visibles sin esperar aprobación.
- **Centro de moderación:** pestañas Sin revisar / Denunciados / Retirados / Revisados / Todos, con paginación y detalle completo al tocar cualquier publicación.
- El administrador puede mantener/aprobar o retirar un anuncio; se puede restaurar.
- Denuncias de anuncios por usuarios registrados; moderación sin exponer datos personales privados.
- Formularios distintos para Servicios, Belleza, Alquiler, Compra y venta, Transporte, Empleo, Comida y Conocer gente.
- Página de detalle adaptada con fotos, precio contextual, atributos y contacto.
- Perfil social con avatar, portada, país, ciudad, bio, anuncios y grupos.
- Creación y membresía en grupos; grupos nuevos requieren aprobación.
- Botón para mostrar/ocultar contraseña durante inicio de sesión/registro.

## Privacidad y seguridad

Los anuncios aprobados, información del perfil que el usuario decide publicar, y números WhatsApp incluidos en anuncios públicos podrán ser vistos por visitantes. Nunca publicar claves `sb_secret` o `service_role` en frontend; solo se usa `sb_publishable`.

Base de datos con RLS, límites de 15 anuncios nuevos por cuenta/hora, denuncia única por usuario/anuncio y moderación por RPC verificada para administrador. Las nuevas entradas se controlan a nivel del servidor.

Las **pruebas automatizadas** cubren carga de categorías y grupos desde Supabase, navegación, modal de detalles, contraseña visible/oculta y formularios adaptados. También se han probado consultas SQL transaccionales (revertidas) de publicación y moderación. **Falta una ronda de aceptación en teléfonos reales con una segunda cuenta**, especialmente subida de imágenes, correo de confirmación y actualización APK entre firmas distintas, antes de distribuirlo a todos los miembros del WhatsApp.

## Piezas principales

- `index.html`, `app.js`, `community.js`, `v5.js`, `v5.css` y `logo-v5.webp`.
- `app/`, `build.gradle`, `settings.gradle`: aplicación Android.
- `.github/workflows/pages.yml`: despliegue web.
- `.github/workflows/android-apk.yml`: build y release Android.
- `.github/workflows/smoke-web.yml`: pruebas web automatizadas.

Desarrollado para la comunidad LATINOS EN JEREZ · SIN LÍMITES.
