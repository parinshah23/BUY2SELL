import NewAdminLayout from "./NewAdminLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <NewAdminLayout>
      {children}
    </NewAdminLayout>
  );
}
