import React, {
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useEffect,
  useId,
  useState,
} from "react";
import ReactTooltip, { TooltipProps } from "react-tooltip";
import { Slot } from "@radix-ui/react-slot";

import styles from "./styles.module.css";

interface CustomTooltipProps extends TooltipProps {
  message: string;
  children: ReactNode;
  asChild?: boolean;
}

const TooltipComponent: ForwardRefRenderFunction<
  ReactTooltip,
  CustomTooltipProps
> = ({ children, message, asChild, ...tooltipProps }, ref) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const Wrapper = asChild ? Slot : "div";
  const tooltipId = useId();

  return (
    <React.Fragment>
      <Wrapper data-tip data-for={tooltipId} className={styles.tooltipTrigger}>
        {children}
      </Wrapper>
      {isMounted && (
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
      )}
    </React.Fragment>
  );
};

export const Tooltip = forwardRef(TooltipComponent);
