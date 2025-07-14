import { RootLayout } from "@/src/components/root-layout";
import "./globals.css";

import { cookies } from "next/headers";

const Layout = async ({ children }: { children: React.ReactElement }) => {
  const cookieStore = await cookies();
  const lng = cookieStore.get("i18next")?.value || "en";

  return <RootLayout lng={lng}>{children}</RootLayout>;
};

export default Layout;
