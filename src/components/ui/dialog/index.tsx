import classNames from "classnames";
import { ReactNode } from "react";
import ReactModal from "react-modal";

import styles from "./styles.module.css";

export interface DialogProps {
  onRequestClose(): void;
  isOpen: boolean;
  children?: ReactNode;
  overlayClassName?: string;
  className?: string;
}

function Dialog(props: DialogProps) {
  const inBrowser = typeof window !== "undefined";

  const appElement =
    (inBrowser && document.getElementById("__next")) || undefined;

  return (
    <ReactModal
      {...props}
      overlayClassName={classNames(
        styles.dialogOverlay,
        props.overlayClassName
      )}
      className={classNames(styles.dialogContainer, props.className)}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      appElement={appElement}
    >
      {props.children}
    </ReactModal>
  );
}

export default Dialog;
