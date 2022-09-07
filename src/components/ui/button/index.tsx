import {
  ComponentProps,
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
} from "react";
import className from "classnames";

import styles from "./styles.module.css";
import { FaSpinner } from "react-icons/fa";

type ButtonProps = ComponentProps<"button"> & {
  colorScheme?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
};

function ButtonComponent(
  { colorScheme = "primary", isLoading, disabled, ...props }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={className(
        props.className,
        styles.buttonContainer,
        styles[`${colorScheme}ColorScheme`]
      )}
      ref={ref}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <FaSpinner size={18} className={styles.spinner} />
      ) : (
        props.children
      )}
    </button>
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(ButtonComponent);

export default Button;
