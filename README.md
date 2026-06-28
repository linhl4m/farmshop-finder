# Farmshop Finder

## Links

- Repository: https://github.com/linhl4m/farmshop-finder

---

## Overview

Farmshop Finder is a marketplace that connects customers with nearby farms. Farms can register, set up a public profile and list products for direct sale. Customers can discover farms, browse products, add items to a cart, place orders, and leave reviews.

This was built as a scoped MVP within a 20-hour budget. The goal was not exhaustive feature coverage but a polished, working slice of the core product flow:

**Discover a farm → Browse products → Place an order**

---

## Tech Stack

| Layer                   | Technology              |
| ----------------------- | ----------------------- |
| Framework               | Next.js 16 (App Router) |
| CMS / Backend           | Payload CMS 3           |
| Database                | MongoDB Atlas           |
| Styling                 | Tailwind CSS            |
| Map                     | Mapbox GL JS            |
| URL state               | nuqs                    |
| Icons                   | Lucide React            |
| Deployment              | Vercel                  |
| Image uploads & storage | Vercel Blob Storage     |

---

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Environment variables

Create a `.env` file:

```env
DATABASE_URL=
PAYLOAD_SECRET=
NEXT_PUBLIC_SERVER_URL=
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=
```

### Seed the database

```bash
pnpm seed
```

Seeds 1 admin, 10 customers, 20 farms with 5–12 products each, reviews, and orders.

Images are downloaded from `picsum.photos` and are intentionally random. They do not necessarily match the seeded farm or product data and are only meant to provide visual placeholders for the demo.

### Start development server

```bash
pnpm dev
```

### Production build

```bash
pnpm build
pnpm start
```

---

## Features

### Customer

- Browse and search farms and products by name, price, distance, farm type and product category
- Map view with farm pins (Mapbox)
- Farm profile pages with product listings
- Shopping cart (cookie-based, no account required to add items)
- Place orders and view order history
- Save farms and products to favorites
- Leave reviews and ratings for farms and products

### Farm Owner

- Register and set up a public farm profile (name, description, type, region, cover image)
- Manage product listings (create, edit, delete)
- View and update incoming orders
- Dashboard overview with statistics

### Admin

Administrative tasks (reviewing farms, removing listings, managing users) are handled through Payload's built-in Admin Panel at `/admin`.

---

## Architecture

### Payload as the single source of truth

All application logic lives inside the Payload collection config rather than being scattered across server actions. Business rules are enforced at the collection level via hooks, so they apply regardless of how a mutation is triggered.

| Hook             | Collection | What it does                                                                                           |
| ---------------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| `beforeValidate` | Products   | Sets `farm` from the logged-in user so farm owners can only create products for their own farm         |
| `afterChange`    | Reviews    | Recalculates `ratingAverage` and `ratingCount` on the related farm and product                         |
| `beforeChange`   | Orders     | Snapshots product names and prices at order time so historical orders are not affected by future edits |

### Role-based access

The application separates customer, farm owner, and admin experiences. Payload access rules are used to restrict which users can read, create, update, or delete specific documents.

### Data fetching

- **Server Components** use the Payload Local API (`getPayload`) for all page-level data fetching. These functions live in `src/lib/data/` and are marked `import 'server-only'`.
- **Server Actions** (`"use server"`) are used exclusively for mutations (create, update, delete). They never fetch data.
- Client-side fetching was rarely needed for this MVP, therefore TanStack Query was intentionally not introduced to avoid unnecessary complexity.

### Cart in cookies

The cart is stored in an HTTP-only cookie rather than the database. This allows unauthenticated users to add products without creating an account and keeps the checkout flow lightweight.

### URL-based filters with nuqs

Search filters are synchronized with the URL via `nuqs`, making filter state shareable and persistent across page refreshes.

### Mapbox

Farm locations are displayed on an interactive Mapbox map. Clicking a farm pin opens a popup with a link to the farm profile. The map is rendered as a client component because it relies on browser APIs.

For simplicity, the map defaults to Berlin when no user location has been selected or shared. This provides a sensible starting point for exploring the application without requiring immediate location access.

### MongoDB Atlas

MongoDB integrates directly with Payload and works well for document-based data such as farms, products, reviews, and orders.

### Vercel Blob Storage

Uploaded farm and product images are stored in Vercel Blob. Since the application is deployed on Vercel, using Blob Storage provided a simple, fully managed solution without introducing additional infrastructure such as S3 or Cloudinary.

### Icons with Lucide

Lucide React was chosen because it provides a modern, consistent icon set, integrates nicely with React components, and keeps the bundle size small.

### Built-in Payload Admin Panel

Administrative functionality is intentionally handled through Payload's built-in Admin Panel. Creating a separate custom admin dashboard would duplicate existing functionality and add unnecessary complexity for the MVP.

---

## Product Decisions

### What was prioritized

The core flow was treated as non-negotiable:

**Discover a farm → Browse products → Place an order**

Everything was evaluated against how much it contributed to this flow.

### Homepage and Farms Page

The homepage intentionally reuses the same farm feed and filters as the dedicated farms page. The main goal of the application is helping users discover nearby farms, so exposing this functionality directly on the homepage was prioritized for the MVP.

Trending products are shown at the top of the homepage to give users immediate inspiration and a quick idea of what they can buy. While the main focus is discovering nearby farms, showing only farms on the homepage could make it harder for users to understand the actual products available in the marketplace at first glance.

Reusing the same farm feed also reduced implementation complexity and kept the experience consistent.

In a production version, the homepage could evolve into a more curated experience by combining featured farms, seasonal products, trending products, and personalized recommendations instead of displaying the same farm feed.

### Farm Profile Pages

Farm profile pages intentionally do not display all products immediately. Instead, they highlight a small selection of currently available products and a dedicated "Seasonal Favorites" section.

The farm profile serves as the farm's home base and should primarily give visitors an impression of the farm itself and what kind of products it offers, rather than overwhelming them with a long product list.

If users want to explore the full catalog, they can navigate to the dedicated products page via the "View all products" link.

### What was built beyond the core

- Favorites
- Reviews and ratings
- Map view
- Saved products
- Responsive customer and farm dashboards

### What was intentionally omitted

| Feature                                | Reason                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Real payments                          | Explicitly out of scope in the brief. Checkout simulates a completed payment.                     |
| Email verification / farm verification | Requires email infrastructure and additional flows outside MVP scope.                             |
| Password reset                         | Requires email infrastructure and recovery flows.                                                 |
| Farm experiences / bookings            | Nice-to-have from the brief, deprioritized in favor of the shopping flow.                         |
| Subscription / produce boxes           | Nice-to-have from the brief and significant complexity for low MVP value.                         |
| Pagination / infinite scrolling        | Omitted to keep focus on core functionality and because the dataset is relatively small.          |
| Geocoding (address → coordinates)      | Farm owners manually enter latitude and longitude values to avoid additional APIs and complexity. |
| In-app notifications                   | Visual placeholder only.                                                                          |
| Dedicated reviews pages                | Reviews are shown directly on farm and product pages.                                             |
| Custom admin dashboard                 | Payload's Admin Panel already covers the required functionality.                                  |
| Multiple image galleries               | Farms and products currently use a single cover image to keep forms and data management simple.   |

### Reviews are purchase-gated

Customers can only submit a review if they have previously placed an order from the corresponding farm or purchased the corresponding product. This helps prevent fake reviews and makes ratings more trustworthy.

### Favorites are customer-only

Saving farms and products is intentionally limited to customers. Farm owners and administrators do not benefit from this functionality, so restricting it to customers keeps the experience focused.

### Out-of-season / sold-out products remain visible

Unavailable products are intentionally still shown so customers can understand the full offering of a farm and know what products may become available again in the future.

---

## UI Decisions

### Mobile-first

All pages were designed mobile-first with responsive layouts and dedicated mobile navigation.

### Consistent Filtering Experience

The same sidebar filter component is reused across all desktop pages that support filtering.

This keeps the experience consistent and avoids exposing users to multiple filtering patterns throughout the application. Once users understand how filtering works in one section, they can immediately use the same interaction everywhere else.

### Sidebar Filters

A sidebar layout was chosen for filtering instead of placing multiple dropdowns above the content.

The sidebar keeps all filter options visible at the same time and minimizes the number of clicks required to refine results. With a top navigation approach, users would often need to repeatedly open and close multiple select menus, making the filtering experience slower and less transparent.

Keeping all filters visible also makes it easier to understand which filters are currently active.

### Favorites page

Saved farms and saved products are displayed one below another on the same page for simplicity.

In a production application, tabs or segmented navigation would likely provide a better user experience for users with many favorites.

### Header navigation placeholders

The **Trending** and **Seasonal** navigation items are included purely for presentation purposes and to indicate potential future discovery features.

They intentionally do not route to separate pages in the MVP.

### Notification icon

The notification icon is also only a visual placeholder and does not currently provide any functionality.

### Dashboard statistics

Dashboard statistics are currently hardcoded placeholders and exist to demonstrate how analytics could be presented in a future version.

### Images

Farms and products currently use a single cover image.

In a production version, both entities would likely support multiple images and image galleries.

---

## Simplifications for the MVP

- Checkout directly redirects to a success page and simulates a completed purchase.
- Real payment providers such as Stripe or PayPal were intentionally omitted.
- Order cards are simplified and only show the most relevant information.
- Forgot password and account recovery flows are omitted.
- Notifications are placeholders only.
- Trending and Seasonal sections are presentation-only.
- Farm owners manually provide coordinates instead of entering an address.
- Review listing pages are omitted.
- Image galleries are intentionally limited to a single cover image.

---

## Possible Improvements

- Stripe integration
- Email notifications
- Password reset and account recovery
- Email verification and farm verification
- Geocoding and address autocomplete
- Pagination and infinite scrolling
- Dedicated reviews pages
- Push and in-app notifications
- Recommendation engine for Trending and Seasonal sections
- Multiple image galleries for farms and products
- Better TypeScript coverage and fewer `any` usages
- Optimistic UI updates where beneficial
- Advanced farm analytics and reporting
- Image optimization and external file storage
- Automated testing

---

## Deployment

The application is deployed on Vercel and uses MongoDB Atlas as its database. Environment variables are configured through the Vercel project settings.

---

## Notes on Scope

The project was intentionally scoped around the primary user journey:

**Discover a farm → Browse products → Place an order**

Several nice-to-have features from the brief were deliberately deprioritized in order to deliver a polished and functional MVP within the given time budget.

The architecture was designed so these features can be added incrementally in future iterations without major refactoring.
