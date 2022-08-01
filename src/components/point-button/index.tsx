import classNames from "classnames";
import { ComponentProps, ForwardedRef, forwardRef } from "react";

import styles from "./styles.module.css";

type PointButtonProps = ComponentProps<"button"> & {
  selected?: boolean;
};

function PointButtonComponent(
  { selected, ...props }: PointButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={classNames(props.className, {
        [styles.pointButtonContainer]: true,
        [styles.selected]: selected,
      })}
      ref={ref}
    >
      {props.children}
    </button>
  );
}

const PointButton = forwardRef<HTMLButtonElement, PointButtonProps>(
  PointButtonComponent
);

export default PointButton;
