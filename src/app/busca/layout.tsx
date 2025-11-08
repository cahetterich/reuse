import type { ReactNode } from "react";
import UserNavbar from "@/app/components/UserNavbar";

export default function BuscaLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--reuse-light)" }}>
      <UserNavbar />
      <main style={{ flex: 1, padding: 32, marginLeft: 220 }}>{children}</main>
    </div>
  );
}
