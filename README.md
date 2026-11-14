# LATINOS EN JEREZ — SIN LÍMITES 🇪🇸🌎

Aplicación comunitaria para Jerez de la Frontera. Publica anuncios con fotos de servicios, empleo, alquiler, comida, compra/venta y amistad.

## Estado

- Frontend publicado en el repositorio con Supabase conectado: `mznovniuffafmpnaqemk`.
- Base de datos y almacenamiento creados; todos los anuncios entran como `pending`.
- Para **activar la web pública** el propietario debe ir a [Settings → Pages](https://github.com/suelafirme/Latinos-en-jerz/settings/pages) y elegir **GitHub Actions** como Source.
- Después ejecutar el workflow [Deploy Latinos en Jerez](https://github.com/suelafirme/Latinos-en-jerz/actions/workflows/pages.yml) desde **Run workflow** (branch main).
- Web cuando el despliegue finalice: https://suelafirme.github.io/Latinos-en-jerz/

## Confirmación de emails

En [Supabase Authentication URL Configuration](https://supabase.com/dashboard/project/mznovniuffafmpnaqemk/auth/url-configuration) configurar **Site URL** con `https://suelafirme.github.io/Latinos-en-jerz/` y añadir la misma URL como **Redirect URL**. Esto es necesario para que las confirmaciones de correo vuelvan a la app.

## Dar acceso al primer administrador

El primer usuario debe crear cuenta y confirmar el correo (si corresponde). En [Supabase Authentication → Users](https://supabase.com/dashboard/project/mznovniuffafmpnaqemk/auth/users), copiar su UUID y ejecutar una sola vez:

```sql
insert into public.admin_members(user_id)
values ('UUID-DEL-ADMIN')
on conflict do nothing;
```

El administrador verá los anuncios pendientes en «Mi perfil», podrá aprobar o rechazar. No existe acceso administrativo por autodeclaración.

## Archivos

- `index.html`: interfaz móvil.
- `app.js`: navegación, autenticación, anuncios, imágenes y moderación.
- `config.js`: URL y clave **publicable** del proyecto Supabase, sin secretos.
- `.github/workflows/pages.yml`: despliegue automático.

Esta es una **web app**, no un fichero APK nativo. Se puede abrir desde Android y añadir a la pantalla de inicio. No incluye pagos ni mensajería interna. Los datos de contacto que un usuario publica podrán mostrarse públicamente en su anuncio.

No añadas claves `service_role` al repositorio.
