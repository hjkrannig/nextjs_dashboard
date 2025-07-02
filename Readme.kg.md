
# next-starter-example from vercel: nextjs-dashboard

### Chapter 1  Installation
Install sugested package-manager

- sudo npm install -g pnpm

Install starter-files

- npx create-next-app@latest nextjs-dashboard --example 
    "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" 
    --use-pnpm

Adding more packages

  - pnpm i use-debounce

Url at github
  - git@github.com:hjkrannig/nextjs_dashboard.git

### Chapter 2 Styling
Adding a global.css file e.g ui/styles/global.css
  - import it in the App.layout.tsx

Adding tailwind.css
  - in this example tailwind is already installed and configured. Import
    the tailwind-classes in App.layout.tsx and configure tailwind.config.ts

Adding module.css-file
  - create a module.css file in ui/styles/home.module.css and import it in 
    the modul where it is to be used
  - import styles from "...ui/styles/home.module.css"
  - use it in the component e.g. as "div className={styles.classname}"

### Chapter 3 Optimizing Fonts and Images
Font and Image-optimization is implemented in nextjs out of the Box. So
far it seems, that both only works when deployed on vercel??

#### Font-Optimization
Create a font.ts in .../ui and import the Font you want to use. Import from 
Google or local

```
import { Inter, Lusitana } from "next/font/google";
  
export const inter = Inter({ subsets: ["latin"] });
export const lusitana = Lusitana({ subsets: ["latin"], weight: ["400", "700"] });
```
These exported fonts can be used in any model as

  - className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}

When the usage is declared e.g. in body of app.layout.ts, the font is the 
default for all the pages

#### Image-optimization
Images should be used with the Image-Component from next.js. When they are 
not beeing in the public-folder-structure and come from an external url, 
this url is to be specifiedi in next.config.ts like

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
  - The route's name is the folder.  Routes can be nested as needed.
  - If there is a layout.tsx this is the structure for this... and 
    all the nested routes, so long as another layout.tsx is defined 
    in a subfolder.
  - To prevent this downdrilling layout, a folder (overview) can be created
    and in here the loading, layout and page is to be placed. This then is 
    a router-group whith no effect on the child-folders.
  - The app.layout.tsx is the main-layout. Here are the global.css-styles, 
    the global.fonts ant e.g. the body-styles imported and defined

### Chapter 5 Navigation and Links
  - instead of the href="" use the Link-component from next/link. This provides 
    the reload when switching the routes.
  - for styling the links, the url can be obtained by using a react-hook:
    - const pathname =usePathname() (from next/navigation)

### Chapter 6 Setting up the Database
  - create a new vercel-supabase-account
  - automatically all the secrets for .env are beeing shown and can be copied
  - when deploying on vercel, these secrets must go to the env-variables, where
    they can all be pasted in the first input field as one.
  - the seed-route was not working directly and did not create a user, when changing 
    the users password to a more secret one, everything worked fine!

### Chapter 7 Fetching data
In this tutorial, the data-handling is done with nearly raw SQL. The sql-handler 
is postgres from postgres. The secrets come from .env e.g.

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
Next renders all pages, which only need static data when building the app. All other
pages, which needs updating data are rendered dynamically. 
If there is a loading.tsx beneath the page.tsx, then this loading-component will be
shown until the data are beeing fetched.
When there are multiple Components to be loaded and the data-transfer is some 
longer, some shorter, then the app-structure should define the loading in the 
components needing the data. The parent-component can then wrap the child-component 
in a Suspense-Component with a fallback="Loading-Component". This lets only the 
child component showing the loader, the rest of the page is seen immediatly.
Fetching multiple data (fetch-calls) for one page should be done with async 
Promise like 

  - [DATA1, DATA2, DATA3]=Promise.all([fetch1, fetch2, fetch3)


### Chapter 10 PartialPreRendering
PPR is a experimental feature from next@canary. It allows the pre-rendering of pages
with Suspended-Components, which are ready-rendered in the state of loading. When
the data is fetched, the content will be replaced with the dynamic part included.
To use this feature, e.g in the dashboard.page.ts there are several steps to be done
  - pnpm install next@canary
  - edit the next.config.ts like the code-example below
  - in dashboard.layout.ts "export const experimental_ppr=true"

``` next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental'
  }
};

export default nextConfig;
```

### Chapter 11 Search and Pagination


### Chapter
