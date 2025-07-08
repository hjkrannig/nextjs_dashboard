# next-starter-example from vercel: nextjs-dashboard

### Chapter 1 Installation

Install sugested package-manager

- sudo npm install -g pnpm

Install starter-files

- npx create-next-app@latest nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" --use-pnpm

Adding more packages
- pnpm i use-debounce
- pnpm i next-auth

Url at github
- git@github.com:hjkrannig/nextjs_dashboard.git

### Chapter 2 Styling

Adding a global.css file e.g ui/styles/global.css

- import it in the App.layout.tsx

Adding tailwind.css

- in this example tailwind is already installed and configured. Import the tailwind-classes in App.layout.tsx and configure tailwind.config.ts

Adding module.css-file

- create a module.css file in ui/styles/home.module.css and import it in the modul where it is to be used
- import styles from "...ui/styles/home.module.css"
- use it in the component e.g. as "div className={styles.classname}"

### Chapter 3 Optimizing Fonts and Images

Font and Image-optimization is implemented in nextjs out of the Box. So far it seems, that both only works when deployed on vercel??

#### Font-Optimization

Create a font.ts in .../ui and import the Font you want to use. Import from Google or local

```
import { Inter, Lusitana } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
export const lusitana = Lusitana({ subsets: ["latin"], weight: ["400", "700"] });
```

These exported fonts can be used in any model as

- className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}

When the usage is declared e.g. in body of app.layout.ts, the font is the default for all the pages

#### Image-optimization

Images should be used with the Image-Component from next.js. When they are not beeing in the public-folder-structure 
and come from an external url, this url is to be specifiedi in next.config.ts like

```
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zlwwxvuersmgtuovqqex.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
      },
    ],
  },
};

export default nextConfig;
```

When using the Image-component the alt, width and height-props are mandatory.

### Chapter 4 Creating Layouts and Pages

- Every folder in the app-directory which has a page.tsx is a route.
- The route's name is the folder. Routes can be nested as needed.
- If there is a layout.tsx this is the structure for this... and all the nested routes, so long as 
  another layout.tsx is defined in a subfolder. 
- To prevent this downdrilling layout, a folder (overview) can be created and in here the loading, 
  layout and page is to be placed. This then is a router-group whith no effect on the child-folders.
- The app.layout.tsx is the main-layout. Here are the global.css-styles, the global.fonts ant e.g. the 
  body-styles imported and defined

### Chapter 5 Navigation and Links

- instead of the href="" use the Link-component from next/link. This provides the reload when 
  switching the routes.
- for styling the links, the url can be obtained by using a react-hook:
  - const pathname =usePathname() (from next/navigation)

### Chapter 6 Setting up the Database

- create a new vercel-supabase-account
- automatically all the secrets for .env are beeing shown and can be copied
- when deploying on vercel, these secrets must go to the env-variables, where they can all be pasted 
  in the first input field as one.
- the seed-route was not working directly and did not create a user, when changing the users password 
  to a more secret one, everything worked fine!

### Chapter 7 Fetching data

In this tutorial, the data-handling is done with nearly raw SQL. The sql-handler is postgres from postgres. 
The secrets come from .env e.g.

```
import postgres from "postgres";
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}
```

### Chapter 8-9 Static- dynamic-rendering, loading, Suspense

Next renders all pages, which only need static data when building the app. 
All other pages, which needs updating data are rendered dynamically. If there is a loading.tsx 
beneath the page.tsx, then this loading-component will be shown until the data are beeing fetched. 
When there are multiple Components to be loaded and the data-transfer is some longer, some shorter, 
then the app-structure should define the loading in the components needing the data. The parent-component 
can then wrap the child-component in a Suspense-Component with a fallback="Loading-Component". 
This lets only the child component showing the loader, the rest of the page is seen immediatly. 
Fetching multiple data (fetch-calls) for one page should be done with async Promise like

- [DATA1, DATA2, DATA3]=Promise.all([fetch1, fetch2, fetch3)

### Chapter 10 PartialPreRendering

PPR is a experimental feature from next@canary. It allows the pre-rendering of pages with Suspended-Components, 
which are ready-rendered in the state of loading. When the data is fetched, the content will be replaced with 
the dynamic part included. To use this feature, e.g in the dashboard.page.ts there are several steps to be done

- pnpm install next@canary
- edit the next.config.ts like the code-example below
- in dashboard.layout.ts "export const experimental_ppr=true"

```next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental'
  }
};

export default nextConfig;
```

### Chapter 11 Search and Pagination

#### Using the hooks in client-component

In here the use of useSearchParams, usePathname and useRouter is explained. T
he useSearchParams() gives access to the query-string of the url. It is to be used with URLSearchParams() as (search.ts):

- const searchParams=useSearchParams()
- const params= URLSearchParams(searchParams)
- params.set(queryKey, queryValue)
- params.delete(queryKey) Now, having a params-object usePathname and useRoute comes into play
- pathname = usePathname()
- {replace}= useRouter() And now updating the url and routing to as:
- replace(`${pathname}?${params.toString()}`)

When using the hooks, the Component is to be set as

- "use client"

#### Using the server-side to get to searchParams

Only the page.ts itsself has server-side-access to searchParams as

```
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
```

These properties can now be drilled down to all components needing them

#### Using Debouncing

When typing the search in the search.input, by using onChange() every type-click will force a new DB-request. 
This is not intended! My way to solve this problem is to work with forms, submit and formdata or e.currentTarget. 
This provides a search on every return-press and feels good. A more specific way is to use debounced function-call. 
This means, that there is a timeout calling the intended handler-function. As long as typing, every click sets the 
timer back to 0. When there is a pause or no more typing longer than the timeout, the handler-callback is 
called and executed. There is a lib for doing so as:

- pnpm i use-debounce
- import {useDebouncedCallback } from "use-debounce"
- const handler = UseDebouncedCallback(){...}

#### Using Pagination

Pagination is done in a few steps: getting the current-page from url-query in page.tsx, 
fetching the totalPages with the actual query with a count-request to the db, setting the desired 
page in the user-interface into the url and fetch the current-page-data as:

- const currentPage = Number(searchParams?.page || 1
- const totalPages = await(fetchInvoicesPages(query)
- fetch the first page and build the page-ui Pagination
- in here calculate the new URL after every click on the Pagination-Buttons:

```
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };
```

This new calculated URL leads to fetching the correct data as:

- const invoices = await fetchFilteredInvoices(query, currentPage);


### Chapter 12 Updating data, ServerActions, FormData, dynamic route

#### Server Actions
ServerActions can be called from client- or server-components and will be executed asynchron directly on the Server. 
They must have the directive "use server" at top of the module or at top of the function-body. 
They will be used with the form-action-attribute, which sends the native FormData-Object directly to the ServerAction.
When there is a need for transmittig additional data, like the id for update, a hidden field in the form should be used
or the action function must be "bind" like
  -  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  - Trying to transmitt the id directly seems to work, but forinstance the redirect()-directive fails!
The flow in the serverAction is as follows:
  - first update or create data with an async-await call to the db
  - second update the cache with the manipulated data by calling relavidatePath() from next/cache
  - third redirect to the overview-table by calling redirect() from next/navigation 

#### Dynamic Routes
A folder within the AppFolder with e.g. [id] is a dynamic route. It should be constructed like
  - /dashboard/invoices/[id]/edit
The dynamic part can be fetched in the page-component like

```
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
```
Up here data can be fetched in the same manner as with searchParams.


### Chapter 13 Error-handling, try--catch, error.tsx, notFound from next/navigation and not-found.tsx
- Error-prone code should be wrapped in try-catch-block
- uncaught errors can be responded by rendering the errer.tsx-page (nearest page in path)
- the 404 can be handled with  notFound from next/navigation and corresponding not-found.tsx

### Chapter 14 Improving Accessibility == Form Validation

#### HTML validation
- simple form-validation is to add the required-prop in the form-field. This will cause a client-side
  validation with a browser-generated error-message

#### zod Validation in actions.ts
- define a type State and a zod-schema as:
```
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
```
- the schema-validation-definitions have changed in zod@4, so by using zod@4 a check of the 
  documents is required.
- get the validatedFields-Object from safeParse, check for error and when passed post to the DB

```
export const createInvoice = async (prevState: State, formData: FormData) => {
 const validatedFields = CreateInvoice.safeParse(Object.fromEntries(formData));
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice",
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  try
  ...
}
```

#### Form-Validation in form with useActionState-hook from React
- import the type StateT from action.ts
- get the state from the useActionState-hook and implement the error-blocks in the form. 
- The callback of the action-prop of the form is the "callAction" from the hook

```
const formDataState: State = { message: null, errors: {} };
const formAction = type === "create" ? createInvoice : updateInvoiceWithId;
const [state, callAction] = useActionState(formAction, formDataState);

```
- An Example for the Error-Block-Component to be placed under the formfield is
```
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
```

- Placed under the amount-field:
```
<ErrorMessage id="amount-error" stateField={state.errors?.amount} />
```




### Chapter 15
- pnpm i next-auth
- openssl rand -base64 32
  - Fe2kWWeJ2jsuDNtQSa6/5/8mQYRY7tAcrcNsRB5kd7U=

- an next-auth beteiligte neue module sind
- auth.config.ts
  - defines the custom signIn-page, the authorized-callback which redirects the
    authorized user to the desired page and the providers (auth-providers), like
    next-credentials, google, github etc....

- auth.ts
  - defines the authorize-callback for the given provider. Here it is only 
    Credentials. The authorize will be called in the authenticate-function
    from action.ts, which is the action for form.action in login-form

- middleware.ts
  - exports a config.object, which holds the routes to be protected, and as
    default export NextAuth from "next-auth". Here the config-object from 
    auth.config.ts is used.

- action.ts
  - defines the authenticate-function, which is the action in edit-form. It
    uses the signIn-function exported from auth.ts

- login-form.tsx
  - here the form.action is called, the FormData-object holds email and password
    and the error-handling is managed.

