import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
  containerID?: string;
}

function Portal({ children, containerID = "__next" }: PortalProps) {
  const [container, setContainer] = useState<HTMLElement>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setContainer(document.getElementById(containerID));
    }
  }, []);

  return <>{container && createPortal(children, container)}</>;
}

export default Portal;
