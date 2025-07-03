"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { createInvoiceDB } from "./postdb";

const redirectPath = "/dashboard/invoices";
const FormSchemaZ = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});
const CreateInvoice = FormSchemaZ.omit({ id: true, date: true });

export const createInvoice = async (formData: FormData) => {
  const { customerId, amount, status } = CreateInvoice.parse(Object.fromEntries(formData));
  createInvoiceDB(customerId, amount, status);
  revalidatePath(redirectPath);
  redirect(redirectPath);
};
