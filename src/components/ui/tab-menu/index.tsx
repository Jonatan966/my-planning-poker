import classNames from "classnames";

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
}

function TabMenu({
  selectedMenu,
  menus,
  disabled,
  setSelectedMenu,
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
        >
          {menu.name}
        </button>
      ))}
    </div>
  );
}

export { TabMenu };
