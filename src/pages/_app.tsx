import { withTRPC } from "@trpc/next";
import Layout from "../components/Layouts";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { httpLink } from "@trpc/client/links/httpLink";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
