# System Architecture (ARCHITECTURE.md)

## System Boundaries
The **Chopnchop** platform operates as a decoupled architecture. This repository (`chopnchop-frontend`) represents the monolithic frontend application containing distinct user boundaries:
1. **Customer Portal** (`app/(public)`, `app/checkout`, `app/orders`): Public-facing application for browsing menus and placing scheduled orders.
2. **Vendor Portal** (`app/vendor`): Secure workspace for partner kitchens to manage meals, view manifests, and handle payouts.
3. **Admin Portal** (`app/admin`): Super/Sub-admin dashboard for platform oversight, user management, and emergency operations.
4. **Rider Portal** (Future Implementation): Dedicated portal for independent logistics partners to onboard, view delivery manifests, manage scheduled delivery routes, and track commission-based payouts.

These boundaries are strictly enforced through routing, isolated React Contexts (`AdminAuthContext`, `VendorAuthContext`), and distinct Axios instances.

## Module Relationships
```text
[ Next.js App Router (UI Layer) ]
       |            |
       v            v
[ Zustand Stores ] [ React Contexts ]
  (Cart, UI)        (Auth States)
       |            |
       +------------+
             |
             v
[ Service Layer (services/*.ts) ]
             |
             v
[ Axios Interceptors (lib/axios.ts) ]
             |
             v
[ External REST API (Java Spring Boot) ]
```

## Request Lifecycle
1. **User Action**: User interacts with a UI component.
2. **State/Service Invocation**: Component calls a Zustand store method or a Service function directly.
3. **API Client**: The Service function calls the respective Axios instance (`api`, `adminApiClient`, `vendorApiClient`).
4. **Interception**: 
   - *Request*: Interceptor attaches the domain-specific JWT from `localStorage`.
   - *Response*: Interceptor catches 401/403 errors. For Admin, it attempts a silent token refresh via `/api/v1/auth/refresh`. For others, it triggers a logout.
5. **Data Return**: The response data is returned to the Service, which may transform it before returning it to the Component/Store.
6. **UI Update**: State is updated, triggering a React re-render.

## Data Flow
- **Global UI State**: Managed by Zustand (`cartStore.ts`, `uiStore.ts`). Persisted to `localStorage` where applicable (e.g., Cart items).
- **Authentication State**: Managed by React Context. Read from `localStorage` on mount, then held in memory for snappy UI updates.
- **Server Data**: Fetched via Axios in `useEffect` (for client components) or directly in Server Components (though currently, the app leans heavily on `"use client"` dashboards).

## Infrastructure Assumptions
- **Deployment**: Vercel (indicated by `vercel.json` and Next.js usage).
- **Backend**: A separate Java Spring Boot backend hosted on compatible infrastructure (e.g., AWS EC2/ECS, Heroku), accessible via `NEXT_PUBLIC_API_URL`.
- **Image Storage**: Cloudinary (inferred from memory context), but uploads are handled via backend pass-through (`POST /api/v1/admin/catalog/categories/{categoryId}/image`).

## Scaling Considerations
- **Client-Side Rendering vs. Server-Side Rendering**: The admin and vendor dashboards are heavily client-side (`"use client"`). The customer menu page should leverage Next.js Server Components and ISR to handle traffic spikes before delivery cut-off times.
- **State Hydration**: Zustand stores are persisted to `localStorage`. Care must be taken to handle hydration mismatches between server-rendered HTML and client-side persisted state.

## External Integrations
- **Payment Gateway**: Paystack (planned/mocked in `services/payment.service.ts`).
- **Backend API**: Custom REST API powered by Java Spring Boot (`https://api.chopnchop.com/v1`).

## Design Patterns Used
- **Domain-Driven Directory Structure**: Code is grouped by feature/domain rather than file type (e.g., `app/admin`, `services/admin`, `components/admin`).
- **Repository/Service Pattern**: API calls are abstracted into `services/` instead of being written directly in components.
- **Optimistic UI Updates**: Status toggles (e.g., activating/deactivating a category) update the UI immediately before the API call resolves, rolling back if the call fails.
- **Mobile-First Responsive Pattern**: Complex tables strictly switch to card layouts on mobile screens (`md:hidden` vs `hidden md:block`).
