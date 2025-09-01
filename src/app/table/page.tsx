import DashboardLayout from "../components/layouts/dashboard";
import ScheduleTable from "../components/schedule/schedule";

export default function page() {
  return (
    <DashboardLayout>
      <ScheduleTable />
    </DashboardLayout>
  )
}
