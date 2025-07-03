import Invoices from "../../ui/invoices/invoices";
import { SearchParamsT } from "@/app/lib/definitions";

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
