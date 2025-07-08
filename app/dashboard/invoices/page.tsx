import Invoices from "../../ui/invoices/invoices";
import { SearchParamsT } from "@/app/lib/definitions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices",
};

type PropsT = {
  searchParams?: Promise<SearchParamsT>;
};

export default async function Page(props: PropsT) {
  const searchParams = await props.searchParams;
  // console.log("invoices.page", searchParams);
  return (
    <>
      <Invoices searchParams={searchParams} />
    </>
  );
}
