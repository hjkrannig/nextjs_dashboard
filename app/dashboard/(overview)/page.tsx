import { fetchLatestInvoices, fetchCardData } from "@/app/lib/dbget";
import Dashboard from "@/app/ui/dashboard/dashboard";

export default async function Page() {
  return <Dashboard />;
}
