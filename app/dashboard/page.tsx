import Card from "@/app/ui/dashboard/cards";
import RevenueChart from "../ui/dashboard/revenue-chart";
import LatestInvoices from "../ui/dashboard/latest-invoices";
import { lusitana } from "../ui/fonts";
import { fetchRevenue, fetchLatestInvoices, fetchCardData } from "../lib/data";

export default async function Page() {
  // const [revenue, latestInvoices, cardData] = await Promise.all([
  //   fetchRevenue(),
  //   fetchLatestInvoices(),
  //   fetchCardData(),
  // ]);
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  const cardData = await fetchCardData();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-3xl`}>Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card cardData={cardData} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}
