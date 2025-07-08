import Form from "@/app/ui/invoices/form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers, fetchInvoiceById } from "@/app/lib/dbget";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Invoice",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers] = await Promise.all([fetchInvoiceById(id), fetchCustomers()]);
  if (!invoice) {
    notFound(); // will render the nearest not-found.tsx in path
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          { label: "Edit Invoice", href: `dashboard/invoices/${id}/edit`, active: true },
        ]}
      />
      <Form type="edit" invoice={invoice} customers={customers} />
    </main>
  );
}
