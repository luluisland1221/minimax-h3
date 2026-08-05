import { AccountOverview } from '@/components/dashboard/account-overview';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: 'Account center', isCurrentPage: true }]}
      />
      <AccountOverview />
    </>
  );
}
