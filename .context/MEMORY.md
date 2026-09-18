# Project Memory (MEMORY.md)

## Project Overview
- **Project Purpose**: A production-ready frontend application for **Chopnchop**, a revolutionary scheduled food delivery platform.
- **Business/Domain Goal**: Eliminate food waste and rider delays through a scheduled, batch-based delivery model instead of traditional on-demand delivery. Provides guaranteed delivery slots, batch cooking for kitchens, and optimized rider logistics.
- **Target Users**: Urban professionals, office workers, and corporate teams in high-density commercial hubs (Lekki, Yaba, Victoria Island). Includes portals for Customers, Vendors (kitchens/restaurants), Admins, and independent Riders (logistics partners paid on commission).

## Tech Stack
- **Frontend Technologies**: Next.js 14+ (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React (for professional icons).
- **Backend Technologies**: Java Spring Boot (REST API backend, currently accessed via `https://api.chopnchop.com/v1`).
- **Databases**: Relational Database (typically PostgreSQL or MySQL in the Java Spring Boot ecosystem) handled by the external backend.
- **Infrastructure**: Frontend deployed on Vercel (indicated by `vercel.json`); Backend hosted on standard Java Spring Boot compatible infrastructure (e.g., AWS EC2, Docker/ECS, or similar).
- **Blockchain/Web3 Integrations**: Not yet and suggested one.
- **Testing Tools**: Not yet and suggested one (Currently utilizing ESLint/TypeScript strict mode for static analysis, but no test runner like Jest/Playwright is visible).
- **Package Managers**: `pnpm` (strictly enforced via `pnpm-workspace.yaml`).

## System Architecture
- **High-Level Architecture Explanation**: The application is a monolithic frontend using Next.js App Router that communicates with an external Java Spring Boot microservice or monolithic backend via Axios. The frontend is cleanly divided into four distinct user experiences (domains): Customer (Public), Admin, Vendor, and Rider.
- **Communication Flow Between Systems**: 
  - The client makes REST API calls using domain-specific Axios interceptors (`lib/axios.ts`).
  - Responses are stored in local Zustand stores (for UI, Cart, Session) or managed via React state/context for Auth.
- **Service Interactions**: Domain-specific service layers (`services/admin`, `services/vendor`, `services/*`) encapsulate all Axios calls.
- **Modular Boundaries**: Strict separation between Admin (`app/admin`), Vendor (`app/vendor`), and Customer (`app/checkout`, `app/orders`) routes, components, and contexts.

## Current Implementation Status
- **Completed Systems**: 
  - Customer MVP (Menu display, Global Cart, Delivery slot selection).
  - Admin Categories Management (CRUD operations with Canvas-based Image Cropper and deferred image upload flow).
  - Multi-portal routing structure.
  - API interceptor setup with JWT handling.
- **Partially Completed Systems**:
  - Vendor Portal (Routing exists, auth exists, but deeper features like payout/KYC might be mocked or pending).
  - Admin Dashboard (UI components exist, but full real-time integration is pending).
- **Missing Systems**: Phase 2/3 features like "Close Kitchen" emergency controls, PDF Kitchen manifest export, Rider manifest UI, WebSockets for real-time updates. A fully dedicated Rider Portal (onboarding, logistics operations, and commission tracking) is yet to be developed.
- **Unstable Areas**: Image cropping and preview logic previously caused infinite hook loops (recently fixed using `useRef` for stable Object URLs, but needs careful observation).

## Folder Structure Analysis
- `app/`: Next.js App Router. Contains strictly domain-based routing (`admin/`, `vendor/`, `checkout/`, etc.).
- `components/`: Highly typed, reusable UI components. Split by domain (`admin/`, `vendor/`) and shared generic components.
- `context/`: React context providers for domain-specific Auth (`AdminAuthContext.tsx`, `VendorAuthContext.tsx`).
- `services/`: API communication layer isolating Axios calls from UI components.
- `store/`: Zustand global state management, persisted to `localStorage` (e.g., `cartStore.ts`).
- `types/`: Centralized TypeScript interfaces (DTOs).

## Backend Architecture
- **Controllers**: Handled by external Java Spring Boot backend (typically standard Spring `@RestController` classes).
- **Services**: Handled by external Java Spring Boot backend (business logic annotated with `@Service`).
- **Repositories**: Handled by external Java Spring Boot backend (typically Spring Data JPA/Hibernate).
- **Middleware**: Handled by external Java Spring Boot backend (Spring Security filters, interceptors).
- **Auth Flow**: Handled by external Java Spring Boot backend (JWT based, likely integrated with Spring Security).
- **Validation Flow**: Handled by external Java Spring Boot backend (likely utilizing `jakarta.validation` constraints).
- **API Patterns**: RESTful, separated by domains (`/admin/*`, `/vendor/*`, `/payments/*`, etc.).

## Frontend Architecture
- **Routing**: Next.js App Router (`app/`).
- **State Management**: Zustand for global state (Cart, Session), React Context for Auth, standard React hooks (`useState`) for local component state.
- **Reusable UI Structure**: Component-driven. Shared components (`Button`, `Card`, `Modal`) at the root of `components/`, domain-specific ones nested.
- **API Integration Strategy**: Centralized Axios clients (`lib/axios.ts`) with distinct instances for Customer, Admin, and Vendor to handle specific token logic. API calls are wrapped in service functions.
- **Page/Component Organization**: Server-first data fetching preferred by Next.js, but heavily utilizing `"use client"` for interactive dashboards.

## Database Design
- **Schema Overview**: Handled by external backend.
- **Important Relationships**: Handled by external backend.
- **Entity Responsibilities**: Defined in `types/` (e.g., `MealCategory`, `Order`, `Vendor`, `AdminUser`).

## Authentication & Authorization
- **Auth Mechanism**: JWT (JSON Web Tokens).
- **Session/Token Flow**: 
  - Customer: Standard Bearer token.
  - Vendor: `vendor_access_token` in `localStorage`, wiped on 401.
  - Admin: `admin_access_token` and `admin_refresh_token`. Axios interceptor handles silent refresh via `/api/v1/auth/refresh` on 401/403.
- **Roles and Permissions**: Implicitly managed by distinct login portals and tokens.

## Smart Contract / Blockchain Section
- *(Not Applicable)*

## Environment Configuration
- `NEXT_PUBLIC_API_URL`: The base URL for the backend API.

## Development Conventions
- **Naming Conventions**: PascalCase for React components and Contexts. camelCase for services, hooks, and utilities.
- **Folder Conventions**: Domain-driven feature folders inside `app/`, `components/`, and `services/`.
- **File Organization**: One component per file, colocated sub-components if tightly coupled.
- **API Response Patterns**: Expected to return data directly or throw errors wrapped in Axios objects.
- **Error Handling Style**: Use `axios.isAxiosError(err)` with `catch (err: unknown)` for type-safe backend error parsing.
- **Testing Style**: Not currently implemented.

## Known Issues
- **Bugs**: Aggressive deletion of temporary URLs in Image Cropper was recently patched; ensure `URL.revokeObjectURL` is only called on unmount or ID change.
- **Unstable Implementations**: Complex hook dependencies in modals (e.g., `useEffect` inside `ImageCropperModal.tsx`) require strict adherence to `useRef` for stable references to avoid cascading updates.
- **Temporary Workarounds**: Some mock data is still present in `lib/mock/`.
- **Incomplete Features**: Rider operations, real-time Kitchen Manifests.

## Technical Debt
- Mock data needs to be fully replaced by real API calls in certain domains.
- A robust testing framework (Jest/React Testing Library) needs to be integrated to ensure UI stability, given the strict CI/CD requirements.

## AI Agent Instructions
- **What to preserve**: The strict domain separation between Admin, Vendor, Rider, and Customer. The scheduled delivery business logic (do NOT add on-demand features).
- **What to avoid changing**: The Axios interceptor logic for Admin token refreshing, unless explicitly requested. The `pnpm` package manager enforcement.
- **Architectural rules**: 
  - **ChopnChop Mobile Responsiveness & Mobile App Experience Standard**: Implementations must fully comply with this standard (Excluding the Super Admin and Sub Admin Portal that should take the Table format in desktop view, cards, grids and lists format can be for mobile (phone and tablet) device view). All pages, components, tables, forms, dashboards, modals, and workflows must be mobile-first, fully responsive, and provide a native-app-like experience on mobile devices while maintaining consistency with the ChopnChop design system and primary color (#FC6B31).
  - Use Lucide Utensils or professional icons; avoid emojis for placeholders.
  - Category Image Upload must use the deferred flow (`POST .../{categoryId}/image`) after the entity is created.
- **Coding expectations**: Strict TypeScript. No `any` types. Resolve all ESLint warnings immediately.
- **Implementation patterns to follow**: Use `axios.isAxiosError(err)` for error handling. Use native HTML5 Canvas for image cropping with `useRef` for Object URLs.

## Recent Project Direction
- **Latest Implementations**: The Admin Categories Management section (`app/admin/dashboard/categories`), including complex image cropping, pagination, soft-delete toggling, and UI refinements.
- **TODO Comments / Unfinished Code**: API endpoints in `services/payment.service.ts` point to mock/stubbed endpoints that need actual Paystack integration.
- **Unfinished Work**: Connecting the Vendor portal to live backend endpoints for meals and orders.

## Recommended Next Steps
1. Finalize the Vendor Portal integration with live backend endpoints.
2. Implement the Paystack payment gateway in `checkout`.
3. Build out the "Phase 2: Ops" features (Kitchen manifest export, Rider manifest UI).
4. Integrate a testing framework and write core tests for the Cart and Auth flows.
