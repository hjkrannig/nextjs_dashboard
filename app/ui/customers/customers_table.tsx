import Image from "next/image";
import { lusitana } from "@/app/ui/common/fonts";
import Search from "@/app/ui/invoices/search_with_debounced";
import { CustomersTableType, FormattedCustomersTable } from "@/app/lib/definitions";

export default async function CustomersTable({
  customers,
}: {
  customers: FormattedCustomersTable[];
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              <TableSM customers={customers} />
            </div>
            <table className="hidden min-w-full rounded-md text-gray-900 md:table">
              <TableMDHeader />
              <TableMDBody customers={customers} />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableSM({ customers }: { customers: FormattedCustomersTable[] }) {
  return (
    <>
      {customers?.map((customer, index) => (
        <div
          key={customer.id}
          className={`mb-2 w-full rounded-md border-b-4 p-4 ${index % 2 ? "bg-slate-100" : ""} `}>
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <div className="mb-2 flex items-center">
                <div className="flex items-center gap-3">
                  <Image
                    src={customer.image_url}
                    className="rounded-full"
                    alt={`${customer.name}'s profile picture`}
                    width={28}
                    height={28}
                  />
                  <p>{customer.name}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>
          <div className="flex w-full items-center justify-between border-b py-5">
            <div className="flex w-1/2 flex-col">
              <p className="text-xs">Pending</p>
              <p className="font-medium">{customer.total_pending}</p>
            </div>
            <div className="flex w-1/2 flex-col">
              <p className="text-xs">Paid</p>
              <p className="font-medium">{customer.total_paid}</p>
            </div>
          </div>
          <div className="pt-4 text-sm">
            <p>{customer.total_invoices} invoices</p>
          </div>
        </div>
      ))}
    </>
  );
}

function TableMDHeader() {
  return (
    <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
      <tr>
        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
          Name
        </th>
        <th scope="col" className="px-3 py-5 font-medium">
          Email
        </th>
        <th scope="col" className="px-3 py-5 font-medium">
          Total Invoices
        </th>
        <th scope="col" className="px-3 py-5 font-medium">
          Total Pending
        </th>
        <th scope="col" className="px-4 py-5 font-medium">
          Total Paid
        </th>
      </tr>
    </thead>
  );
}

function TableMDBody({ customers }: { customers: FormattedCustomersTable[] }) {
  return (
    <tbody className="divide-y divide-gray-200 text-gray-900">
      {customers.map((customer, index) => (
        <tr
          key={customer.id}
          className={`w-full border-b ${index % 2 ? "bg-slate-100" : ""} py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg`}>
          <td className="whitespace-nowrap  py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
            <div className="flex items-center gap-3">
              <Image
                src={customer.image_url}
                className="rounded-full"
                alt={`${customer.name}'s profile picture`}
                width={28}
                height={28}
              />
              <p>{customer.name}</p>
            </div>
          </td>
          <td className="whitespace-nowrap  px-4 py-5 text-sm">{customer.email}</td>
          <td className="whitespace-nowrap  px-4 py-5 text-sm">{customer.total_invoices}</td>
          <td className="whitespace-nowrap  px-4 py-5 text-sm">{customer.total_pending}</td>
          <td className="whitespace-nowrap  px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
            {customer.total_paid}
          </td>
        </tr>
      ))}
    </tbody>
  );
}
