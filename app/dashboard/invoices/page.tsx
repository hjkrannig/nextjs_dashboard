import { ProjectOptions } from "next/dist/build/swc/types";
import Invoices from "../../ui/invoices/invoices";
import { SearchParamsT } from "@/app/lib/definitions";

// type PropsT = {
//   searchParams?: Promise<{
//     query?: string;
//     page?: string;
//   }>;
// type PropsT = {
//   searchParams?: SearchParamsT;
// };

type PropsT = {
  searchParams?: Promise<SearchParamsT>;
};

export default async function Page(props: PropsT) {
  const searchParams = await props.searchParams;
  return (
    <>
      <Invoices searchParams={searchParams} />
    </>
  );
}
