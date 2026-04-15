import LandingInteractions from "@/components/LandingInteractions";
import SiteNavbar from "@/components/SiteNavbar";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LandingInteractions />
      <SiteNavbar />
      {children}
    </>
  );
}
