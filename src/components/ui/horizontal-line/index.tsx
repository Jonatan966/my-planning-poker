import { ComponentProps, ForwardedRef, forwardRef } from "react";

import styles from "./styles.module.css";

type HorizontalLineProps = ComponentProps<"div">;

function HorizontalLineComponent(
  props: HorizontalLineProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div {...props} className={styles.horizontalLineContainer} ref={ref} />
  );
}

export const HorizontalLine = forwardRef<HTMLDivElement, HorizontalLineProps>(
  HorizontalLineComponent
);
