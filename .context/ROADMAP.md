# Project Roadmap (ROADMAP.md)

## Current Milestone Progress
**Phase 1: MVP (Current)** - ~85% Complete
The core customer-facing flow (Menu, Cart, Delivery Slots) and the foundational Admin operations (Auth, Categories) are largely complete. The system architecture, API interceptors, and styling guidelines are firmly established.

## Completed Milestones
- [x] Next.js App Router project setup with Tailwind CSS v4 and pnpm.
- [x] Global State Management (Zustand) for Cart and Session.
- [x] Centralized API Layer (Axios) with domain-specific interceptors and JWT refresh logic.
- [x] Customer UI: Global Cart, Checkout layout, Menu display.
- [x] Admin UI: Auth flow, Admin/Vendor contexts.
- [x] Admin Operations: Complex Category management with Canvas-based image cropping and deferred uploads.

## Pending Milestones
### Immediate Term (Finish Phase 1)
- [ ] Finalize live Payment Gateway (Paystack) integration.
- [ ] Connect Vendor Portal to live API (Meals, Orders, Dashboard).
- [ ] End-to-end testing of the Customer Checkout flow.

### Medium Term (Phase 2: Ops)
- [ ] Real-time Admin Dashboard analytics.
- [ ] "Close Kitchen" emergency controls (Admin/Vendor).
- [ ] Kitchen manifest export (PDF-ready UI).
- [ ] Rider Portal integration (Onboarding, Logistics operations handling, Commission tracking).
- [ ] Rider manifest UI and dispatch management.

### Long Term (Phase 3: Scale)
- [ ] Push & In-app Notifications.
- [ ] Real-time updates via WebSockets for Order Tracking and Kitchen Manifests.
- [ ] Performance optimization (Edge caching, aggressive code splitting).
- [ ] Comprehensive Analytics Dashboard for Vendors and Admins.

## Future Scaling Considerations
- **WebSocket Integration**: As the platform scales, polling for order updates will become inefficient. Plan for WebSocket (`socket.io` or standard WS) integration within the Zustand stores.
- **Edge Rendering**: Certain heavily trafficked pages (like the daily menu) should be evaluated for Edge rendering or strict ISR (Incremental Static Regeneration) to handle high-traffic bursts before daily cut-off times.
- **Micro-Frontends**: If the Admin, Vendor, and Customer portals grow significantly, consider splitting them into a Next.js Multi-Zone or Monorepo structure.

## Recommended Implementation Order
1. **Payments**: Unblocks end-to-end testing of the customer journey.
2. **Vendor Portal**: Unblocks vendors from onboarding and adding meals.
3. **Kitchen Manifests**: Critical operational requirement for the batch-cooking model.
4. **Rider UI**: Required for the final mile delivery execution.

## Production-Readiness Checklist
- [ ] All mock data (`lib/mock/*`) removed and replaced with API calls.
- [ ] `NEXT_PUBLIC_API_URL` correctly configured for Staging and Prod environments.
- [ ] Comprehensive error boundaries implemented across all `app/` segments.
- [ ] Zero ESLint warnings and strict TypeScript compilation passes.
- [ ] Payment gateway webhooks securely verified on the backend (frontend handling success callbacks correctly).
- [ ] Mobile UX thoroughly tested (no horizontal scrollbars, touch targets >= 44px).
- [ ] Performance audit (Lighthouse score > 90 for Customer pages).
