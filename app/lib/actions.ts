"use server";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import z from "zod";
import { createInvoiceDB, updateInvoiceDB, deleteInvoiceDB } from "./dbpost";

const redirectPath = "/dashboard/invoices/";
const FormSchemaZ = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});
const CreateInvoice = FormSchemaZ.omit({ id: true, date: true });

export const createInvoice = async (formData: FormData) => {
  // console.log("actions.createInvoice: ");
  const { customerId, amount, status } = CreateInvoice.parse(Object.fromEntries(formData));
  await createInvoiceDB(customerId, amount, status);
  revalidatePath(redirectPath);
  redirect(redirectPath);
};

export const updateInvoice = async (id: string, formData: FormData) => {
  // console.log("actions.updateInvoice: ", id);
  const { customerId, amount, status } = CreateInvoice.parse(Object.fromEntries(formData));
  await updateInvoiceDB(id, customerId, amount, status);
  revalidatePath(redirectPath);
  redirect(redirectPath);
};

export const deleteInvoice = async (id: string) => {
  console.log("actions.deleteInvoice: ", id);
  await deleteInvoiceDB(id);
  revalidatePath(redirectPath);
};
