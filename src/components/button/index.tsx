import { ForwardedRef, forwardRef, HTMLAttributes } from "react";
import className from "classnames";

import styles from "./styles.module.css";

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  colorScheme?: "primary" | "secondary" | "danger";
};

function ButtonComponent(
  { colorScheme, ...props }: ButtonProps,
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
    >
      {props.children}
    </button>
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(ButtonComponent);

export default Button;
