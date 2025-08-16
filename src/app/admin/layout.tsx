// This layout ensures the AuthProvider is available for all admin routes.
// Protection of routes is handled in the specific dashboard layout.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
