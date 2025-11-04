## FNP Assignment – React + TypeScript + Vite

A clean, production-ready React app scaffolded with Vite and TypeScript. It implements a simple product management flow (list, create, edit) with authentication gating, modern UI components, and predictable state management.

### Tech stack
- **React 19 + TypeScript**
- **Vite 7** for fast dev/build
- **Redux Toolkit** and **React Redux** for state management
- **React Router** for routing and protection (`ProtectedRoute`)
- **Ant Design** for UI components
- **ESLint** with TypeScript rules


---

## Getting started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 8

### Install
```bash
npm install
```

### Run (development)
```bash
npm run dev
```
Vite will print a local URL (e.g., `http://localhost:5173`).

### Type-check + Build (production)
```bash
npm run build
```

### Preview the production build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

---

## Project structure

```text
assignment/
  eslint.config.js
  index.html
  package.json
  public/
    fnpLogo.png
    vite.svg
  src/
    App.tsx
    index.css
    main.tsx
    assets/
      fnpLogo.png
      react.svg
    components/
      AppLayout.tsx        # Shell layout with header/sidebar/content
      ProductForm.tsx      # Shared form used for create/edit
      ProductTable.tsx     # Data table for products (Ant Design Table)
      ProtectedRoute.tsx   # Route guard for authenticated screens
      WelcomeSplash.tsx    # Animated welcome overlay (shown after login)
    pages/
      Login.tsx
      ProductCreate.tsx
      ProductEdit.tsx
      ProductList.tsx
    store/
      hooks.ts             # Typed hooks: useAppDispatch/useAppSelector
      index.ts             # Store configuration
      slices/
        authSlice.ts       # Auth state (login/logout)
        counterSlice.ts    # Sample slice (scaffold/example)
        productSlice.ts    # Products state (CRUD, filters, etc.)
  tsconfig*.json
  vite.config.ts
```

---

## How to use the app
- **Login**: Navigate to the login page and authenticate. Protected routes are gated by `ProtectedRoute`. The login page is split-view; hover the top-right info icon to reveal demo credentials.
- **Products**: View the product list. Create and edit use a shared `ProductForm` for consistent UX.
- **State**: Global state is managed in Redux Toolkit slices (`authSlice`, `productSlice`).
- **Filters**: Click “Add Filter” to filter by State, Category, and Shipping Type.
- **Bulk upload (CSV)**: Click “Bulk Upload” to drop a CSV and add products.

### CSV format for Bulk Upload
- Required headers: `name`, `price`, `category`
- Optional headers: `subcategory`, `description`, `shippingType`, `state`, `imageUrl`, `finalPrice`, `cid`

Example:
```
name,price,category,subcategory,description,shippingType,state,imageUrl,finalPrice,cid
Chocolate Cake,180,CAKE,FNP Luxe,Rich choco cake,COURIER,PUBLISHED,https://...,199,CAK_510
```

---

## Key design choices
- **Redux Toolkit for state**: Predictable, type-safe reducers, built-in immutability and devtools, and easy async flows if needed.
- **React Router + `ProtectedRoute`**: Keeps auth concerns declarative at the routing layer.
- **Ant Design UI**: Speeds up delivery with accessible, responsive components and consistent design language.
- **Vite + TypeScript**: Fast DX, strict typing, and straightforward build pipeline.
- **Shared `ProductForm`**: Reduces duplication between create/edit pages and ensures validations remain single-sourced.
- **UI polish**: Themed focus rings, sleek scrollbars, subtle hover animations for a clean, modern look.
- **On-login splash**: Branded overlay provides delightful feedback and then fades out to content.

---

## Scripts (from `package.json`)
- **dev**: start Vite dev server
- **build**: type-check and build for production
- **preview**: serve built app locally
- **lint**: run ESLint on the project

---

## Notes
- No external backend is required for local development; product state is handled client-side via Redux slices.
- If you introduce environment variables later, prefer a `.env` file and reference via `import.meta.env` per Vite conventions.
- Authentication persistence uses `localStorage` under key `authState`. Clear site data to reset.

