"use server";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import z from "zod";
import { createInvoiceDB, updateInvoiceDB, deleteInvoiceDB } from "./dbpost";

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const FormSchemaZ = z.object({
  id: z.string(),
  customerId: z.string({
    required_error: "Please select a customer.",
    invalid_type_error: "Not a string",
  }),
  amount: z.coerce.number().gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status",
  }),
  date: z.string(),
});
const CreateInvoice = FormSchemaZ.omit({ id: true, date: true });

const redirectPath = "/dashboard/invoices/";

export const createInvoice = async (prevState: State, formData: FormData) => {
  // console.log("actions.createInvoice: ");
  const validatedFields = CreateInvoice.safeParse(Object.fromEntries(formData));
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice",
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  try {
    await createInvoiceDB(customerId, amount, status);
  } catch (error) {
    console.log(error);
    return { message: "The invoice could not be created. Database failed!" };
  }
  revalidatePath(redirectPath);
  redirect(redirectPath);
};

export const updateInvoice = async (id: string, prevState: State, formData: FormData) => {
  // console.log("actions.updateInvoice: ", id);
  const validatedFields = CreateInvoice.safeParse(Object.fromEntries(formData));
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice",
    };
  }
  const { customerId, amount, status } = validatedFields.data;

  try {
    await updateInvoiceDB(id, customerId, amount, status);
  } catch (error) {
    console.log(error);
    return {
      message: "The invoice could not be updated...invoiceId manipulated? Database failed!",
    };
  }
  revalidatePath(redirectPath);
  redirect(redirectPath);
};

export const deleteInvoice = async (id: string) => {
  // console.log("actions.deleteInvoice: ", id);
  // throw new Error("Failed to delete invoice...");
  try {
    await deleteInvoiceDB(id);
  } catch (error) {
    console.log(error);
  }
  revalidatePath(redirectPath);
};
