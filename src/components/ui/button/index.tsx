import { ComponentProps, ForwardedRef, forwardRef } from "react";
import className from "classnames";

import styles from "./styles.module.css";
import { FaSpinner } from "react-icons/fa";

type ButtonProps = ComponentProps<"button"> & {
  colorScheme?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  outlined?: boolean;
  isShort?: boolean;
};

function ButtonComponent(
  {
    colorScheme = "primary",
    isLoading,
    isShort,
    disabled,
    outlined,
    ...props
  }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={className(
        props.className,
        styles.buttonContainer,
        styles[`${colorScheme}ColorScheme`],
        { [styles.outlined]: outlined, [styles.shortPadding]: isShort }
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
