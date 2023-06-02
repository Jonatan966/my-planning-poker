import classNames from "classnames";
import { ForwardedRef, forwardRef, ComponentProps } from "react";

import styles from "./styles.module.css";
import { FaArrowDown } from "react-icons/fa";

type DropdownProps = ComponentProps<"select">;

function DropdownComponent(
  props: DropdownProps,
  ref: ForwardedRef<HTMLSelectElement>
) {
  return (
    <div className={styles.dropdownContainer}>
      {props.title && (
        <label htmlFor={props.name} className={styles.dropdownLabel}>
          {props.title}
        </label>
      )}
      <select
        {...props}
        ref={ref}
        className={classNames(props.className, styles.dropdown)}
      >
        {props.children}
      </select>
      <FaArrowDown className={styles.dropdownArrow} />
    </div>
  );
}

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  DropdownComponent
);
