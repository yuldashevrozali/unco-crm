import DashboardLayout from "../components/layouts/dashboard";

export default function LidlarPage() {
  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800">📋 Lidlar</h1>
        <p className="text-gray-600 mt-2">Bu yerda barcha lidlar ro‘yxati chiqadi.</p>
      </div>
    </DashboardLayout>
  );
}
