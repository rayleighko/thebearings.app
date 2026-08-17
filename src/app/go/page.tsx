import { notFound } from 'next/navigation';

/** go.thebearings.app root has no index — only /:slug redirects. */
export default function GoIndexPage() {
  notFound();
}
