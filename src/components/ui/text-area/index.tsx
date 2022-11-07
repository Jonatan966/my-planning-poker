import classNames from "classnames";
import { ForwardedRef, forwardRef, ComponentProps } from "react";

import styles from "./styles.module.css";

type TextAreaProps = ComponentProps<"textarea">;

const SINGLE_ROW_HEIGHT_IN_REM = 1.438;

function TextAreaComponent(
  props: TextAreaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) {
  const dynamicTextareaHeight = SINGLE_ROW_HEIGHT_IN_REM * (props.rows || 1);

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
        style={{
          ...props.style,
          minHeight: `${dynamicTextareaHeight}rem`,
        }}
      />
    </div>
  );
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  TextAreaComponent
);
