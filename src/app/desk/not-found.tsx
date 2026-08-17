import { headers } from 'next/headers';
import { DeskNotFound } from '@/components/desk/DeskNotFound';
import { deskIndexHref } from '@/lib/desk/urls';

export default async function DeskSegmentNotFound() {
  const host = (await headers()).get('host') ?? '';
  return <DeskNotFound homeHref={deskIndexHref(host)} />;
}
