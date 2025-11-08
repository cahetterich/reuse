/// src/app/dashboard/layout.tsx
import type { ReactNode } from "react";
import UserNavbar from "../components/UserNavbar";
import styles from "./dashboard.module.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.dashboardWrapper}>
      <UserNavbar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}