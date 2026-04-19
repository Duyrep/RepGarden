import BotNavBar from "@/components/layout/BotNavBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="pb-(--bottom-navigation-height)">{children}</main>
      <BotNavBar />
    </>
  );
}
