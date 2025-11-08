// src/app/items/my/layout.tsx
import type { ReactNode } from "react";
import UserNavbar from "@/app/components/UserNavbar";
import styles from "./myItems.module.css";

export default function MyItemsLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <UserNavbar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}

