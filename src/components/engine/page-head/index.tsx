import { ReactNode } from "react";
import Head from "next/head";

interface PageHeadProps {
  title?: string;
  children?: ReactNode;
}

function PageHead({ title, children }: PageHeadProps) {
  return (
    <Head>
      <title>{title && `${title} | `}My Planning Poker</title>
      {children}
    </Head>
  );
}

export default PageHead;
