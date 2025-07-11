import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
/**
 * This file is the endpoint of an api-route "query/invoices". route.ts seems to be
 * the pendant to page.ts in other app-folders
 * @returns a list of all invoices
 */
async function listInvoices() {
  const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    -- WHERE invoices.amount = 666;
  `;

  return data;
}
/**
 *
 * @returns a JSON-Response according to the listInvoices-SQL-query
 */
export async function GET() {
  try {
    return Response.json(await listInvoices());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
