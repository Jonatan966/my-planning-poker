import React, {
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useId,
} from "react";
import ReactTooltip, { TooltipProps } from "react-tooltip";

import styles from "./styles.module.css";

interface CustomTooltipProps extends TooltipProps {
  message: string;
  children: ReactNode;
}

const TooltipComponent: ForwardRefRenderFunction<
  ReactTooltip,
  CustomTooltipProps
> = ({ children, message, ...tooltipProps }, ref) => {
  const tooltipId = useId();

  return (
    <React.Fragment>
      <div data-tip data-for={tooltipId} className={styles.tooltipTrigger}>
        {children}
      </div>
      <ReactTooltip
        place="bottom"
        effect="solid"
        backgroundColor="#09090A"
        {...tooltipProps}
        id={tooltipId}
        ref={ref}
      >
        {message}
      </ReactTooltip>
    </React.Fragment>
  );
};

export const Tooltip = forwardRef(TooltipComponent);
