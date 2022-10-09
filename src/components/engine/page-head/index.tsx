import { ReactNode } from "react";
import Head from "next/head";

interface PageHeadProps {
  title?: string;
  children?: ReactNode;
}

function PageHead({ title, children }: PageHeadProps) {
  const parsedTitle = title ? `${title} | ` : "";

  return (
    <Head>
      <title>{`${parsedTitle}My Planning Poker`}</title>
      {children}
    </Head>
  );
}

export default PageHead;
