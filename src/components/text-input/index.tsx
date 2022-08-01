import classNames from "classnames";
import { ForwardedRef, forwardRef, ComponentProps } from "react";

import styles from "./styles.module.css";

type TextInputProps = ComponentProps<"input">;

function TextInputComponent(
  props: TextInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <>
      {props.title && (
        <label htmlFor={props.name} className={styles.textInputLabel}>
          {props.title}
        </label>
      )}
      <input
        type="text"
        {...props}
        ref={ref}
        className={classNames(props.className, styles.textInputContainer)}
      />
    </>
  );
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  TextInputComponent
);

export default TextInput;
