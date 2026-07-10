// Renders one or more schema.org objects as a JSON-LD <script>. Server
// component so the structured data is in the initial SSR HTML where crawlers
// read it. Pass a single object or an array of objects.
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; there is no user input here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
