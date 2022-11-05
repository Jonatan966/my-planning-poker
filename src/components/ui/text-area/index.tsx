import classNames from "classnames";
import { ForwardedRef, forwardRef, ComponentProps } from "react";

import styles from "./styles.module.css";

type TextAreaProps = ComponentProps<"textarea">;

function TextAreaComponent(
  props: TextAreaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) {
  return (
    <div className={styles.textAreaContainer}>
      {props.title && (
        <label htmlFor={props.name} className={styles.textAreaLabel}>
          {props.title}
        </label>
      )}
      <textarea
        {...props}
        ref={ref}
        className={classNames(props.className, styles.textArea)}
      />
    </div>
  );
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  TextAreaComponent
);
