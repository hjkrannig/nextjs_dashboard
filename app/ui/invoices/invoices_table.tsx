import Image from "next/image";
import { UpdateInvoice, DeleteInvoice } from "@/app/ui/invoices/buttons";
import InvoiceStatus from "@/app/ui/invoices/status";
import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
import { fetchFilteredInvoices } from "@/app/lib/dbget";
import { InvoicesTable as InvoicesTableT } from "@/app/lib/definitions";

type PropsT = {
  query: string;
  currentPage: number;
};
export default async function InvoicesTable({ query, currentPage }: PropsT) {
  const invoices = await fetchFilteredInvoices(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            <TableSM invoices={invoices} />
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <TableMDHeader />
            <TableMDBody invoices={invoices} />
          </table>
        </div>
      </div>
    </div>
  );
}

function TableSM({ invoices }: { invoices: InvoicesTableT[] }) {
  return (
    <>
      {invoices?.map((invoice, index) => (
        <div
          key={invoice.id}
          className={`mb-2 w-full rounded-md border-b-4 p-4 ${index % 2 ? "bg-slate-100" : "bg-white"} `}>
          <div className="flex items-center justify-between  border-b pb-4">
            <div>
              <div className="mb-2 flex items-center">
                <Image
                  src={invoice.image_url}
                  className="mr-2 rounded-full"
                  width={28}
                  height={28}
                  alt={`${invoice.name}'s profile picture`}
                />
                <p>{invoice.name}</p>
              </div>
              <p className="text-sm text-gray-500">{invoice.email}</p>
            </div>
            <InvoiceStatus status={invoice.status} />
          </div>
          <div className="flex w-full items-center justify-between pt-4">
            <div>
              <p className="text-xl font-medium">{formatCurrency(invoice.amount)}</p>
              <p>{formatDateToLocal(invoice.date)}</p>
            </div>
            <div className="flex justify-end gap-2">
              <UpdateInvoice id={invoice.id} />
              <DeleteInvoice id={invoice.id} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function TableMDHeader() {
  return (
    <thead className="rounded-lg text-left text-sm font-normal">
      <tr>
        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
          Customer
        </th>
        <th scope="col" className="px-3 py-5 font-medium">
          Email
        </th>
        <th scope="col" className="px-3 py-5 font-medium">
          Amount
        </th>
        <th scope="col" className="px-3 py-5 font-medium">
          Date
        </th>
        <th scope="col" className="px-3 py-5 font-medium">
          Status
        </th>
        <th scope="col" className="relative py-3 pl-6 pr-3">
          <span className="sr-only">Edit</span>
        </th>
      </tr>
    </thead>
  );
}

function TableMDBody({ invoices }: { invoices: InvoicesTableT[] }) {
  return (
    <tbody className="bg-white">
      {invoices?.map((invoice, index) => (
        <tr
          key={invoice.id}
          className={`w-full border-b ${index % 2 ? "bg-slate-100" : "bg-white"} py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg`}>
          <td className="whitespace-nowrap py-3 pl-6 pr-3">
            <div className="flex items-center gap-3">
              <Image
                src={invoice.image_url}
                className="rounded-full"
                width={28}
                height={28}
                alt={`${invoice.name}'s profile picture`}
              />
              <p>{invoice.name}</p>
            </div>
          </td>
          <td className="whitespace-nowrap px-3 py-3">{invoice.email}</td>
          <td className="whitespace-nowrap px-3 py-3">{formatCurrency(invoice.amount)}</td>
          <td className="whitespace-nowrap px-3 py-3">{formatDateToLocal(invoice.date)}</td>
          <td className="whitespace-nowrap px-3 py-3">
            <InvoiceStatus status={invoice.status} />
          </td>
          <td className="whitespace-nowrap py-3 pl-6 pr-3">
            <div className="flex justify-end gap-3">
              <UpdateInvoice id={invoice.id} />
              <DeleteInvoice id={invoice.id} />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
