import ProtectedLayout from "../(protected)/layout";

export default function DistributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
