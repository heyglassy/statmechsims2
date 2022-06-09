import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";
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

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";
    return {
      url,
      links: [
        httpLink({
          url: "/api/trpc",
        }),
      ],
    };
  },
  ssr: false,
})(MyApp);
