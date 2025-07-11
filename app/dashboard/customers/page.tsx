import Invoices from "../../ui/invoices/invoices";
import { SearchParamsT } from "@/app/lib/definitions";
import { Metadata } from "next";
import { fetchFilteredCustomers } from "@/app/lib/dbget";
import Customers from "@/app/ui/customers/customers";

export const metadata: Metadata = {
  title: "Customers",
};

type PropsT = {
  searchParams?: Promise<SearchParamsT>;
};

export default async function Page(props: PropsT) {
  const searchParams = await props.searchParams;
  console.log("customers.page", searchParams);
  const query = searchParams?.query || "";
  const customers = await fetchFilteredCustomers(query);
  return <Customers customers={customers} />;
}
