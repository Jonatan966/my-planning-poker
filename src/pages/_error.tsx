import * as Sentry from "@sentry/nextjs";
import NextErrorComponent from "next/error";
import { appConfig } from "../configs/app";

const CustomErrorComponent = (props) => {
  return <NextErrorComponent statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData) => {
  if (!appConfig.isDevelopment) {
    await Sentry.captureUnderscoreErrorException(contextData);
  }

  return NextErrorComponent.getInitialProps(contextData);
};

export default CustomErrorComponent;
