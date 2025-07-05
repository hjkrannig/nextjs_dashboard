import postgres from "postgres";
import { getDBFormatAmount, getDBFormatDate } from "./utils";
import { revalidatePath } from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export const createInvoiceDB = async (customerId: string, amount: number, status: string) => {
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${getDBFormatAmount(amount)}, ${status || "pending"}, ${getDBFormatDate()})
  `;
};

export const updateInvoiceDB = async (
  id: string,
  customerId: string,
  amount: number,
  status: string
) => {
  // console.log("dbpost.updateInvoiceDB:", id);
  await sql` 
    UPDATE invoices 
    SET customer_id=${customerId}, amount=${getDBFormatAmount(amount)}, status=${status}
    WHERE id=${id}
  `;
};

export const deleteInvoiceDB = async (id: string) => {
  await sql`DELETE FROM invoices WHERE id=${id}`;
};
