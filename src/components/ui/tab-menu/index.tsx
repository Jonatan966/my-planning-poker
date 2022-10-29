import classNames from "classnames";
import { ReactNode } from "react";

import styles from "./styles.module.css";

interface Menu {
  id: string;
  name: string;
}

interface TabMenuProps {
  selectedMenu: string;
  menus: Menu[];
  disabled?: boolean;
  setSelectedMenu(menu: string): void;
  children?: ReactNode;
}

function TabMenu({
  selectedMenu,
  menus,
  disabled,
  setSelectedMenu,
  children,
}: TabMenuProps) {
  return (
    <div className={styles.tabOptions}>
      {menus.map((menu) => (
        <button
          key={menu.id}
          className={classNames({
            [styles.selected]: selectedMenu === menu.id,
          })}
          onClick={() => setSelectedMenu(menu.id)}
          disabled={disabled}
          type="button"
        >
          {menu.name}
        </button>
      ))}

      {children && <div className={styles.tabRightContent}>{children}</div>}
    </div>
  );
}

export { TabMenu };
