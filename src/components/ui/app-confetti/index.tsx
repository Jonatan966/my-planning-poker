import classNames from "classnames";
import ReactCanvasConfetti, { IProps } from "react-canvas-confetti";

import styles from "./styles.module.css";

function AppConfetti(props: IProps) {
  return (
    <ReactCanvasConfetti
      {...props}
      className={classNames(props.className, styles.confetti)}
    />
  );
}

export { AppConfetti };
