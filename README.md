# Chopnchop - Scheduled Food Delivery Platform

![Chopnchop Banner](https://via.placeholder.com/1200x400/000000/FF6B00?text=Chopnchop+Platform)

A production-ready frontend application for **Chopnchop**, a revolutionary scheduled food delivery platform.

## 1. Core Problem

Traditional on-demand food delivery is plagued by inefficiencies: extreme uncertainty, long wait times for customers, rider delays, and massive food waste for vendors. The "order anytime" model breaks down during peak hours, leading to cold food and unhappy customers.

## 2. Solution

Chopnchop introduces a **scheduled, batch-based delivery model**. Customers place orders within a specific time window for guaranteed delivery slots. This eliminates uncertainty, allowing kitchens to batch-cook efficiently and riders to optimize delivery routes.

## 3. How It Works

1. **Order Window**: Customers browse the daily menu and place orders before the cutoff time.
2. **Batch Cooking**: Kitchens receive aggregated manifests and cook exactly what is needed.
3. **Delivery Slots**: Food is dispatched in synchronized batches for guaranteed delivery within the selected time slot.

## 4. Benefits

- **For Users**: 100% reliability, guaranteed delivery times, hot food, and transparent pricing.
- **For Business**: Zero food waste, optimized rider logistics, highly predictable revenue, and maximum kitchen efficiency.

## 5. Target Market

Urban professionals, office workers, and corporate teams in high-density commercial hubs:

- Lekki
- Yaba
- Victoria Island (VI)

## 6. Revenue Model

- **Surge Pricing**: Premium pricing for high-demand delivery slots (e.g., 12 PM - 1 PM peak lunch hour).
- **Delivery Batching**: Reduced cost per delivery through optimized, multi-drop routing.
- **Vendor Partnerships**: Revenue share with premium ghost kitchens and partner restaurants.

## 7. Platform Features

### Phase 1: MVP (Current)

- 🍱 Menu display with real-time stock
- 📊 Stock tracking & progress visualization
- 🛒 Global Cart + checkout system
- ⏱️ Delivery slot selection (Standard & Surge)
- 💳 Payment integration UI (Paystack mock)
- ✅ Order confirmation & tracking

### Phase 2: Ops

- 👨‍💻 Admin dashboard (Real-time operations)
- 🛑 "Close Kitchen" emergency controls
- 🖨️ Kitchen manifest export (PDF-ready)
- 🛵 Rider manifest UI

### Phase 3: Scale

- ⚡ Performance optimization (Code splitting, Edge caching)
- 📈 Analytics dashboard
- 🔔 Push & In-app Notifications
- 🔄 Real-time updates (WebSockets)

## 8. Technology Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS (Brand: Orange, Black, Blue)
- **State Management**: Zustand (Persisted)
- **API Layer**: Axios (Centralized interceptors)
- **Forms & Validation**: React Hook Form + Zod
- **Package Manager**: pnpm

## 9. Competitive Advantage

- **Scheduled Delivery**: We don't do on-demand. We do guaranteed, scheduled batch deliveries.
- **Zero Waste Model**: Cook-to-order based on exact pre-order numbers.
- **Tiered Pricing System**: Dynamic slot pricing based on demand and rider availability.

## 10. Engineering Principles

1. Clean project structure (Feature-based)
2. Reusable component design (Props-driven, highly typed)
3. Centralized Axios API layer
4. Server-first data fetching (Next.js App Router best practices)
5. Zustand for global state (Cart, Session, UI)
6. Mobile-first responsive design
7. Tailwind design consistency (Strict brand colors)
8. Middleware-ready authentication structure
9. Performance optimization (Lazy loading, minimal client boundaries)
10. Error handling + loading states globally
11. Test-ready structure
12. Strict `app/` router usage (No `src/` directory)

***

## 📁 Project Structure

```ascii
chopnchop-frontend/
├── .github/
│   └── workflows/
│       └── ci.yml
├── app/                              # Next.js App Router pages & layouts
│   ├── admin/                        # Admin portal (auth + operations dashboard)
│   │   ├── dashboard/
│   │   │   ├── admins/               # Manage admin & sub-admin accounts
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   ├── categories/           # Meal Category management
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── customers/
│   │   │   │   └── page.tsx
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── riders/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   ├── summary/
│   │   │   │   └── page.tsx
│   │   │   ├── support/
│   │   │   │   └── page.tsx
│   │   │   ├── transactions/
│   │   │   │   └── page.tsx
│   │   │   ├── vendors/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── forgot-pin/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── reset-pin/
│   │   │   └── page.tsx
│   │   ├── verify-otp/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── checkout/                     # Checkout flow & slot selection
│   │   └── page.tsx
│   ├── context/
│   │   └── ThemeContext.tsx          # Light/Dark theme provider
│   ├── order/                        # Order success & tracking
│   │   └── success/
│   │       └── page.tsx
│   ├── orders/                       # Customer order history
│   │   └── page.tsx
│   ├── vendor/                       # Vendor portal (auth + dashboard)
│   │   ├── [email]/                  # Vendor workspace (dynamic segment)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── kyc/
│   │   │   │   └── page.tsx
│   │   │   ├── meals/
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   ├── payout/
│   │   │   │   └── page.tsx
│   │   │   ├── prepare/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── ready/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   ├── support/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── verify-otp/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── globals.css                   # Tailwind entry & brand variables
│   ├── layout.tsx                    # Root layout & providers
│   └── page.tsx                      # Landing & Menu page
├── components/                       # Reusable UI components
│   ├── admin/                        # Admin-specific components
│   │   ├── cards/
│   │   │   └── StatsCard.tsx
│   │   ├── categories/               # Category management UI (modals, cropper)
│   │   │   ├── DeleteCategoryModal.tsx
│   │   │   ├── EditCategoryModal.tsx
│   │   │   └── ImageCropperModal.tsx
│   │   ├── header/
│   │   │   └── AdminHeader.tsx
│   │   └── sidebar/
│   │       └── AdminSidebar.tsx
│   ├── vendor/                       # Vendor-specific components
│   │   ├── header/
│   │   │   └── VendorHeader.tsx
│   │   ├── navigation/
│   │   │   └── BottomNavigation.tsx
│   │   └── sidebar/
│   │       └── VendorSidebar.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── CartSidebar.tsx
│   ├── CountdownTimer.tsx
│   ├── InputField.tsx
│   ├── Modal.tsx
│   ├── Navbar.tsx
│   ├── ProgressBar.tsx
│   ├── SlotSelector.tsx
│   └── ThemeToggle.tsx
├── context/                          # Global React context providers
│   ├── AdminAuthContext.tsx
│   └── VendorAuthContext.tsx
├── hooks/                            # Custom React hooks
│   └── useDebounce.ts
├── lib/                              # Core utilities & configs
│   ├── mock/                         # Mock data for development
│   │   ├── admin.mock.ts
│   │   └── vendor.mock.ts
│   ├── axios.ts                      # Centralized API clients & interceptors
│   └── utils.ts                      # Tailwind merge utilities
├── services/                         # API communication layer
│   ├── admin/                        # Admin domain services
│   │   ├── auth.service.ts
│   │   ├── category.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── profile.service.ts
│   │   └── staff.service.ts
│   ├── vendor/                       # Vendor domain services
│   │   ├── auth.service.ts
│   │   ├── kyc.service.ts
│   │   ├── meal.service.ts
│   │   ├── order.service.ts
│   │   ├── payout.service.ts
│   │   ├── support.service.ts
│   │   └── vendor.service.ts
│   ├── menu.service.ts
│   ├── order.service.ts
│   └── payment.service.ts
├── store/                            # Zustand global state
│   ├── cartStore.ts
│   ├── sessionStore.ts
│   └── uiStore.ts
├── types/                            # TypeScript interfaces & DTOs
│   ├── admin.ts
│   ├── category.ts
│   ├── menu.ts
│   ├── order.ts
│   └── vendor.ts
├── public/                           # Static assets
│   ├── Chopnchop-logo01.png
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── .gitignore
├── README.md
├── STYLE-GUIDE.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── tsconfig.json
└── vercel.json
```

## 🚀 Getting Started

1. **Install dependencies** (Strictly `pnpm`)

```bash
pnpm install
```

1. **Run development server**

```bash
pnpm dev
```

1. **Build for production**

```bash
pnpm build
pnpm start
```

