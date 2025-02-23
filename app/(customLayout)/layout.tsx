"use client";
import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "./Layout.module.scss";

export default function CustomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
