import Link from "next/link";
import React from "react";
import styles from "./Sidebar.module.scss";

function Sidebar() {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <h3>Polygon Map</h3>
        </Link>
      </div>
      <div className={styles.sidebar}>
        <ul>
          <li className={styles.sidebarItem}>
            <Link href="/">Home</Link>
          </li>
          <li className={styles.sidebarItem}>
            <Link href="#">Draw Polygons</Link>
          </li>
          <li className={styles.sidebarItem}>
            <Link href="#">Saved Polygons</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
