import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Playhead from "@/components/Playhead";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Playhead />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
