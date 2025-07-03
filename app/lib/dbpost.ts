import postgres from "postgres";
import { getDBFormatAmount, getDBFormatDate } from "./utils";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export const createInvoiceDB = async (customerId: string, amount: number, status: string) => {
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${getDBFormatAmount(amount)}, ${status}, ${getDBFormatDate()})
  `;
};
