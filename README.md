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
* **For Users**: 100% reliability, guaranteed delivery times, hot food, and transparent pricing.
* **For Business**: Zero food waste, optimized rider logistics, highly predictable revenue, and maximum kitchen efficiency.

## 5. Target Market
Urban professionals, office workers, and corporate teams in high-density commercial hubs:
* Lekki
* Yaba
* Victoria Island (VI)

## 6. Revenue Model
* **Surge Pricing**: Premium pricing for high-demand delivery slots (e.g., 12 PM - 1 PM peak lunch hour).
* **Delivery Batching**: Reduced cost per delivery through optimized, multi-drop routing.
* **Vendor Partnerships**: Revenue share with premium ghost kitchens and partner restaurants.

## 7. Platform Features

### Phase 1: MVP (Current)
* 🍱 Menu display with real-time stock
* 📊 Stock tracking & progress visualization
* 🛒 Global Cart + checkout system
* ⏱️ Delivery slot selection (Standard & Surge)
* 💳 Payment integration UI (Paystack mock)
* ✅ Order confirmation & tracking

### Phase 2: Ops
* 👨‍💻 Admin dashboard (Real-time operations)
* 🛑 "Close Kitchen" emergency controls
* 🖨️ Kitchen manifest export (PDF-ready)
* 🛵 Rider manifest UI

### Phase 3: Scale
* ⚡ Performance optimization (Code splitting, Edge caching)
* 📈 Analytics dashboard
* 🔔 Push & In-app Notifications
* 🔄 Real-time updates (WebSockets)

## 8. Technology Stack
* **Frontend**: Next.js 14+ (App Router), React, TypeScript
* **Styling**: Tailwind CSS (Brand: Orange, Black, Blue)
* **State Management**: Zustand (Persisted)
* **API Layer**: Axios (Centralized interceptors)
* **Forms & Validation**: React Hook Form + Zod
* **Package Manager**: pnpm

## 9. Competitive Advantage
* **Scheduled Delivery**: We don't do on-demand. We do guaranteed, scheduled batch deliveries.
* **Zero Waste Model**: Cook-to-order based on exact pre-order numbers.
* **Tiered Pricing System**: Dynamic slot pricing based on demand and rider availability.

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

---

## 📁 Project Structure

```ascii
chopnchop-frontend/
├── app/                  # Next.js App Router pages & layouts
│   ├── admin/            # Phase 2: Ops Dashboard
│   ├── checkout/         # Checkout flow & slot selection
│   ├── order/            # Order success & tracking
│   ├── orders/           # Customer order history
│   ├── globals.css       # Tailwind entry & brand variables
│   ├── layout.tsx        # Root layout & providers
│   └── page.tsx          # Landing & Menu page
├── components/           # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── CartSidebar.tsx
│   ├── CountdownTimer.tsx
│   ├── InputField.tsx
│   ├── Modal.tsx
│   ├── Navbar.tsx
│   ├── ProgressBar.tsx
│   └── SlotSelector.tsx
├── features/             # Domain-specific feature modules
├── hooks/                # Custom React hooks
├── lib/                  # Core utilities & configs
│   ├── axios.ts          # Centralized API client
│   └── utils.ts          # Tailwind merge utilities
├── services/             # API communication layer
│   ├── menu.service.ts
│   ├── order.service.ts
│   └── payment.service.ts
├── store/                # Zustand global state
│   ├── cartStore.ts
│   ├── sessionStore.ts
│   └── uiStore.ts
├── styles/               # Additional stylesheets
├── types/                # TypeScript interfaces & DTOs
│   ├── menu.ts
│   └── order.ts
├── utils/                # Helper functions
├── public/               # Static assets
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

## 🚀 Getting Started

1. **Install dependencies** (Strictly `pnpm`)
```bash
pnpm install
```

2. **Run development server**
```bash
pnpm dev
```

3. **Build for production**
```bash
pnpm build
pnpm start
```
