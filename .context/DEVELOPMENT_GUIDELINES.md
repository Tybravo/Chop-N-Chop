# Development Guidelines (DEVELOPMENT_GUIDELINES.md)

## Coding Standards
- **TypeScript Strictness**: No `any` types. All API responses, props, and state must be strictly typed using interfaces defined in `types/`.
- **Linting**: Zero-tolerance policy for ESLint warnings. Resolve all unused variables and missing hook dependencies.
- **Error Handling**: Always use `try/catch` blocks for async operations. Use type narrowing for Axios errors:
  ```typescript
  try {
    await serviceCall();
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      // Handle backend error
    } else {
      // Handle generic error
    }
  }
  ```

## Architecture Rules
- **Domain Isolation**: Never import `admin` components into `vendor` pages, or vice versa. Shared components must live in the root of `components/`.
- **API Client Usage**: 
  - Customer/Public -> `api`
  - Vendor -> `vendorApiClient`
  - Admin -> `adminApiClient`
- **State Management**: Use Zustand for global data (Cart, Theme). Use React Context *only* for Authentication state. Use local `useState` for UI toggles (modals, dropdowns).

## Commit Conventions
- Use conventional commits (e.g., `feat:`, `fix:`, `refactor:`, `chore:`).
- Keep commits focused on a single logical change.
- Reference issue/ticket numbers if applicable.

## Testing Expectations
- *(Pending Framework Integration)*: Once Jest/Playwright is added, all new utility functions and complex UI components must include unit tests.
- **Manual Testing**: Always test UI changes on both Desktop and Mobile viewports. Ensure no horizontal scrolling occurs on mobile.

## File Organization Standards
- **Components**: One component per file. Use PascalCase for the filename (`MyComponent.tsx`).
- **Hooks**: Use camelCase prefixed with `use` (`useDebounce.ts`).
- **Services**: Group by domain, use `.service.ts` suffix (`auth.service.ts`).
- **Types**: Group by domain, use `.ts` suffix (`admin.ts`, `vendor.ts`).

## Reusable Component Strategy
- **Props-Driven**: Components should be stateless where possible, receiving data and callbacks via props.
- **Tailwind Merge**: Always use `clsx` and `tailwind-merge` (via `lib/utils.ts` `cn()` function) when allowing custom `className` props on reusable components to prevent styling conflicts.
- **Icons**: Use `lucide-react` for all icons. Avoid emojis for professional UI elements.

## Backend Service Patterns
- Services should only handle data fetching and returning data/throwing errors. They should not manage UI state (e.g., loading spinners) or display toast notifications directly.
- **Image Uploads**: Follow the deferred upload pattern. Create the entity first, retrieve its ID, then upload the image to the specific `/{id}/image` endpoint.

## Frontend Composition Rules
- **Modals**: Render modals at the bottom of the DOM tree (or use Portals) to avoid z-index issues. Control visibility via boolean state in the parent component.
- **ChopnChop Mobile Responsiveness & Mobile App Experience Standard**: Implementations must fully comply with the ChopnChop Mobile Responsiveness & Mobile App Experience Standard (Excluding the Super Admin and Sub Admin Portal that should take the Table format in desktop view, cards, grids and lists format can be for mobile (phone and tablet) device view). All pages, components, tables, forms, dashboards, modals, and workflows must be mobile-first, fully responsive, and provide a native-app-like experience on mobile devices while maintaining consistency with the ChopnChop design system and primary color (#FC6B31).

## API Standards
- **Tokens**: Never hardcode tokens. Rely on the Axios interceptors in `lib/axios.ts` to automatically attach tokens to requests.
- **Pagination**: Standardize on `page` and `pageSize` query parameters.

## Hook and Memory Management Rules
- **Object URLs**: When using `URL.createObjectURL()` for image previews, always store the URL in a `useRef` or state, and strictly call `URL.revokeObjectURL()` on component unmount or when the image changes to prevent memory leaks.
- **Dependency Arrays**: Do not ignore `eslint-disable-next-line react-hooks/exhaustive-deps` unless absolutely necessary to prevent infinite loops (e.g., passing a non-memoized canvas drawing function). Prefer `useCallback` or `useRef` to stabilize dependencies instead.
