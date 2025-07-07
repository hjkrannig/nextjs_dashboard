"use client";

import { CustomerField, InvoiceForm } from "@/app/lib/definitions";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/common/button";
import { createInvoice, updateInvoice, State } from "@/app/lib/actions";
import { useActionState } from "react";

type FormPropsT = {
  type: "edit" | "create";
  invoice: InvoiceForm;
  customers: CustomerField[];
};

export default function Form({ type, invoice, customers }: FormPropsT) {
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
  const formDataState: State = { message: null, errors: {} };
  const formAction = type === "create" ? createInvoice : updateInvoiceWithId;
  const [state, callAction] = useActionState(formAction, formDataState);
  return (
    <form action={callAction} aria-describedby="form-error">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <SelectInputCustomer customers={customers} invoice={invoice} state={state} />
        <NumberInputAmount invoice={invoice} state={state} />
        <SelectOptionStatus invoice={invoice} state={state} />
      </div>
      <div id="form-error" aria-live="polite" aria-atomic="true">
        {state.message && <p className="mt-2 text-sm text-red-500">{state.message}</p>}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Cancel
        </Link>
        <Button type="submit">{`${type === "edit" ? "Update" : "Create"} Invoice`}</Button>
      </div>
    </form>
  );
}

/* Invoice Status */
function SelectOptionStatus({ invoice, state }: { invoice: InvoiceForm; state: State }) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium">Set the invoice status</legend>
      <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              id="pending"
              name="status"
              value="pending"
              type="radio"
              defaultChecked={invoice.status === "pending"}
              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
            />
            <label
              htmlFor="pending"
              className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
              Pending <ClockIcon className="h-4 w-4" />
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="paid"
              name="status"
              type="radio"
              value="paid"
              defaultChecked={invoice.status === "paid"}
              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
            />
            <label
              htmlFor="paid"
              className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white">
              Paid <CheckIcon className="h-4 w-4" />
            </label>
          </div>
        </div>
      </div>
    </fieldset>
  );
}

/* Invoice Amount */
function NumberInputAmount({ invoice, state }: { invoice: InvoiceForm; state: State }) {
  const { amount } = invoice;
  return (
    <div className="mb-4">
      <label htmlFor="amount" className="mb-2 block text-sm font-medium">
        Choose an amount
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="amount"
            type="number"
            step={0.01}
            name="amount"
            defaultValue={amount > 0 ? amount : ""}
            placeholder="Enter USD amount "
            className=" block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="amount-error"
          />
          <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
        <ErrorMessage id="amount-error" stateField={state.errors?.amount} />
      </div>
    </div>
  );
}

/* Customer Name */
function SelectInputCustomer({
  invoice,
  customers,
  state,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
  state: State;
}) {
  return (
    <div className="mb-4">
      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
        Choose customer
      </label>
      <div className="relative">
        <select
          id="customer"
          name="customerId"
          defaultValue={invoice.customer_id}
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          aria-describedby="customer-error">
          <option value="" disabled>
            Select a customer
          </option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
      </div>
      <ErrorMessage id="customer-error" stateField={state.errors?.customerId} />
    </div>
  );
}

type StateFieldT = string[] | undefined;
function ErrorMessage({ id, stateField }: { id: string; stateField: StateFieldT }) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {stateField &&
        stateField.map((error: string) => (
          <p className="mt-2 text-sm text-red-500" key={error}>
            {error}
          </p>
        ))}
    </div>
  );
}
