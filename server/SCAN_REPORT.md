# Scan Report: Pages using hardcoded dummy data

Found pages/components with hardcoded arrays and suggested DB helpers to use from `server/db/queries`:

- `app/booking/page.tsx`
  - Dummy: `cars` array, `locations` array
  - Suggest: replace with `getCars()` and `getLocations()` server-side calls or API endpoints.

- `app/page.tsx`
  - Dummy: `featuredCars`, `features`
  - Suggest: use `getFeaturedCars()` for featured items; `features` may remain static or be moved to a CMS/table.

- `app/cars/page.tsx`
  - Dummy: `cars` array, `bodyTypes`
  - Suggest: use `getCars()` and/or filtered queries; `bodyTypes` can be derived from the `cars` table.

- `app/faqs/page.tsx`
  - Dummy: `faqCategories`, `faqs` array
  - Suggest: use `getFaqs()` and store categories in `faqs.category`.

- `app/about/page.tsx`
  - Dummy: `stats`, `features`
  - Suggest: `stats` can be computed from DB counts; `features` can remain static.

Other static lists (navigation, footer) appear to be UI-only and do not necessarily need DB backing.

Next steps:

1. Add database tables and seed data in Neon for `cars`, `locations`, and `faqs`.
2. Replace hardcoded arrays with server-side data fetching calling `server/db/queries` or create API routes under `app/api/`.
3. Optionally add typed DTOs and tests.
