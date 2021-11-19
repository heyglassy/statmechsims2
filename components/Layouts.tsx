import Header from "./Header";

interface AppProps {
  children: JSX.Element;
}

const Layout = ({ children }: AppProps) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
