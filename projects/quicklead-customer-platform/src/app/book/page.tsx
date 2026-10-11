import { BookingWizardV2 } from '../../components/BookingWizardV2';
import { PortalShell, PageHeader } from '../../components/PortalShell';

export default function BookPage() { return <PortalShell active="Book service"><PageHeader eyebrow="QUICKLEAD APPOINTMENTS" title="Book your next service" description="Choose a vehicle, compare current offers, add recommended services and reserve a slot." /><BookingWizardV2 /></PortalShell>; }
