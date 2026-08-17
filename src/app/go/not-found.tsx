import { DeskNotFound } from '@/components/desk/DeskNotFound';

/** go.thebearings.app has no index — send people to the desk host. */
export default function GoSegmentNotFound() {
  return (
    <DeskNotFound
      homeHref="https://desk.thebearings.app/"
      homeLabel="Desk로"
    />
  );
}
