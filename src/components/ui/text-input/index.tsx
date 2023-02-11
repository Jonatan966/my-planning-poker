import classNames from "classnames";
import { ComponentProps, forwardRef, ReactNode } from "react";

import styles from "./styles.module.css";

interface RootProps {
  title?: string;
  name?: string;
  children: ReactNode;
}

type InternalContentProps = ComponentProps<"div">;

type InputProps = ComponentProps<"input">;

function Root(props: RootProps) {
  return (
    <div className={styles.textInputRoot}>
      {props.title && <label htmlFor={props.name}>{props.title}</label>}
      <div className={styles.textInputSubRoot}>{props.children}</div>
    </div>
  );
}

function InternalContent(props: InternalContentProps) {
  return (
    <div
      {...props}
      className={classNames(styles.textInputInternalContent, props.className)}
    >
      {props.children}
    </div>
  );
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      type="text"
      {...props}
      ref={ref}
      className={classNames(styles.textInput, props.className)}
    />
  );
});

export const TextInput = {
  Root,
  Input,
  InternalContent,
};
