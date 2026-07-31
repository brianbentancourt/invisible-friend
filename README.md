# Amigo Invisible

Sorteo de Amigo Invisible / Amigo Secreto / Secret Santa / Amigo Oculto online.
El organizador carga la lista, define exclusiones y cada participante recibe un
enlace secreto individual: nadie —ni siquiera quien organiza— ve las asignaciones
del resto.

Producción: https://amigoinvisible.brianbentancourt.com

## Stack

- Next.js 15 (App Router) + NextUI + Tailwind
- Firebase Auth + Firestore
- SendGrid (email) y Twilio (WhatsApp / SMS)
- MercadoPago (planes de pago)

## Puesta en marcha

```bash
npm install
```

Copia `envexample` a `.env` y completa las variables. Después:

```bash
npm run dev
```

## Variables de entorno

| Variable | Obligatoria | Para qué sirve |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_URL` | **Sí en producción** | URL pública del sitio. Sin ella, las `back_urls` del checkout y los enlaces de los emails apuntan a localhost. |
| `NEXT_PUBLIC_FIREBASE_*` | Sí | Configuración del cliente de Firebase. |
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | Sí | Credenciales del admin SDK (servidor). |
| `SENDGRID_API_KEY` / `SENDGRID_FROM_EMAIL` | Sí | Envío de notificaciones por email. |
| `TWILIO_*` | No | WhatsApp y SMS. Si faltan, esos canales se saltan sin romper el sorteo. |
| `MP_ACCESS_TOKEN` | Para cobrar | Token de MercadoPago. |
| `MP_WEBHOOK_SECRET` | Recomendada | Clave del webhook de MercadoPago. Sin ella no se valida la firma de las notificaciones. |
| `ADMIN_EMAILS` | No | Emails con acceso completo, separados por coma. |
| `NEXT_PUBLIC_GA_ID` | No | Medición de GA4. Sin ella no se envía ningún evento. |
| `NEXT_PUBLIC_ADSENSE_PUB_ID` / `NEXT_PUBLIC_ADSENSE_SLOT_ID` | No | Publicidad. Con sólo el PUB_ID se usan anuncios automáticos. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Meta tag de verificación de Search Console. |
| `NEXT_PUBLIC_AMAZON_TAG_*` / `NEXT_PUBLIC_MELI_TAG_*` | No | Tags de afiliado, **uno por marketplace**. Ver "Afiliados" más abajo. |

## Estructura

```
app/
  [lang]/                  Rutas por idioma (es, en, pt)
    page.js                Landing
    [slug]/page.js         Páginas de contenido SEO (renderer genérico)
    dashboard/             Panel del organizador (funciona sin cuenta)
    sorteo/[drawId]/[secretToken]/   Página de revelación
    opengraph-image.js     Imagen de compartido generada al vuelo
  api/                     Sorteo, checkout, webhook, estado de usuario
config/site.js             URL, idiomas, planes y límites
lib/content/               Contenido SEO por idioma (es.js, en.js, pt.js)
lib/notifications.js       Email / WhatsApp / SMS compartidos
lib/schema.js              Datos estructurados JSON-LD
messages/                  Diccionarios de UI
```

### Añadir una página de contenido

Agrega una entrada al array del idioma correspondiente en `lib/content/`. El
`slug` es la URL, y el `key` enlaza la misma página entre idiomas para generar
los `hreflang`. El sitemap se actualiza solo.

## Idiomas

`es` (por defecto), `en` y `pt`. El middleware detecta el idioma por cookie
`NEXT_LOCALE` o por `Accept-Language` y redirige a `/<locale>/...`.

## Modelo de negocio

- **Gratis**: hasta 15 participantes, con publicidad.
- **Premium** y **Empresas**: pago único vía MercadoPago; el webhook marca al
  usuario en Firestore.
- **Afiliados**: la página de revelación muestra ideas de regalo con enlaces de
  afiliado. Es la página de mayor tráfico del sitio (una visita por participante).
- **Donaciones**: Buy Me a Coffee y PayPal.

### Afiliados

La tienda se elige por **país** (cabecera `x-vercel-ip-country`), no por idioma:
un visitante español no ve MercadoLibre, donde no puede comprar. Si no hay país
disponible (dev local), se usa el idioma como respaldo: `es`→ES, `en`→US, `pt`→BR.

Una tienda aparece sólo si **tiene su tag configurado**. Si para ese país no hay
ninguna tienda con tag, el bloque de ideas de regalo no se renderiza.

Los tags son por marketplace porque Amazon Associates es un programa
independiente en cada dominio: un tag de `amazon.es` no atribuye comisiones en
`amazon.com.br`. Hay que darse de alta en cada uno por separado.

| País | Tiendas (en orden) |
| --- | --- |
| ES | `AMAZON_TAG_ES` |
| UY | `MELI_TAG_UY` |
| AR | `MELI_TAG_AR` |
| CL | `MELI_TAG_CL` |
| BR | `MELI_TAG_BR`, `AMAZON_TAG_BR` |
| MX | `MELI_TAG_MX`, `AMAZON_TAG_MX` |
| US, CA, GB, PE, CO | `AMAZON_TAG_COM` |

El mapa vive en `MARKETPLACES_BY_COUNTRY`, en `lib/affiliate.js`.
