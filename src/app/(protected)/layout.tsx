import MainLayout from "@/app/layout/MainLayout";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ReownRootProvider from "@/providers/ReownProvider";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) redirect("/");

  // Bọc WagmiProvider vào layout để tất cả con đều có WagmiConfig
  return (
    <ReownRootProvider>
    <MainLayout>
      {children}
    </MainLayout>
    </ReownRootProvider>
  );
}
