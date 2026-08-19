type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Server-only JSON-LD. Data is catalog/copy we author — not user HTML. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
