import Header from "./Header";
import Sidebar from "./Sidebar";
import type { ReactElement, ReactNode } from "react";

interface AppProps {
  children: ReactNode;
}

const Layout = ({ children }: AppProps) => {
  return (
    <div>
      <Header />
      <main className="flex">{children}</main>
    </div>
  );
};

export default Layout;
