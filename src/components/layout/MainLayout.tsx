import BotNavBar from "./BotNavBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="h-full">{children}</main>
      <BotNavBar />
    </>
  );
}
