// NOTE: This layout intentionally does NOT mount AdminAuthProvider. The provider
// is already mounted once in the root layout (app/layout.tsx) for the whole app.
// Mounting it here as well ran TWO INDEPENDENT redirect watchers on every /admin/*
// route. After login (user+token written) they raced: the root-mounted provider saw
// only the token -> redirected to /admin/dashboard, then the admin-mounted provider
// had not hydrated yet -> redirected back to /admin/login, and so on, rapidly
// flipping between the dashboard and login pages until a manual URL refresh
// re-hydrated both and the flapping settled.

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
