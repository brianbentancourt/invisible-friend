/**
 * Inserta datos estructurados. Se renderiza en el servidor, así que Google
 * los ve en el HTML inicial sin depender de JavaScript.
 */
export default function JsonLd({ data }) {
    if (!data) return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
