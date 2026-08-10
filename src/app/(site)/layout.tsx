import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublicSiteSettings } from "@/lib/data/public";
import { resolveSiteIdentity } from "@/lib/site";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const identity = resolveSiteIdentity(await getPublicSiteSettings());
  return (
    <>
      <SiteHeader identity={identity} />
      <main id="main-content">{children}</main>
      <SiteFooter identity={identity} />
    </>
  );
}
