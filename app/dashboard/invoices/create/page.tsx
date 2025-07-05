import Form from "@/app/ui/invoices/form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/dbget";
import { InvoiceForm } from "@/app/lib/definitions";

const defaultInvoice: InvoiceForm = {
  id: "",
  customer_id: "",
  amount: 0,
  status: "pending",
};

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Create Invoice",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      />
      <Form type="create" customers={customers} invoice={defaultInvoice} />
    </main>
  );
}
